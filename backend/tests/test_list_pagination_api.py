import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.responses import JSONResponse

from backend.app import main
from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ComparisonRunListResponse,
    EmployeeMasterDataInput,
    ImportBatchListResponse,
    MasterDataEmployeeListResponse,
    MasterDataSnapshotRequest,
    ReviewCaseCreateRequest,
    ReviewCaseListResponse,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_import_batch_list_api import _create_failed_login_batch
from backend.tests.test_review_persistence import _seed_review_sources


def _json_body(response: JSONResponse) -> dict:
    return json.loads(response.body)


class ImportBatchListPaginationTest(unittest.TestCase):
    def _seed_batches(self, database_url: str) -> ImportPersistenceRepository:
        repository = ImportPersistenceRepository(database_url)
        repository.init_schema()
        for batch_id in ("BATCH-PAGE-A", "BATCH-PAGE-B", "BATCH-PAGE-C"):
            _create_failed_login_batch(repository, batch_id)
        return repository

    def test_default_response_is_unchanged_without_limit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            import_repository = self._seed_batches(database_url)
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                response = main.list_import_batches()

        self.assertIsInstance(response, ImportBatchListResponse)
        self.assertNotIsInstance(response, JSONResponse)
        self.assertEqual(list(response.model_dump(mode="json").keys()), ["items"])
        self.assertEqual(len(response.items), 3)

    def test_limit_truncates_and_reports_total_with_next_cursor(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            import_repository = self._seed_batches(database_url)
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                full = main.list_import_batches()
                page = main.list_import_batches(limit=2)

        self.assertIsInstance(page, JSONResponse)
        body = _json_body(page)
        self.assertEqual(list(body.keys()), ["items", "total", "next_cursor"])
        self.assertEqual(len(body["items"]), 2)
        self.assertEqual(body["total"], 3)
        self.assertIsNotNone(body["next_cursor"])
        self.assertEqual(
            [item["batch_id"] for item in body["items"]],
            [row.batch_id for row in full.items[:2]],
        )
        self.assertEqual(body["items"][0], full.items[0].model_dump(mode="json"))

    def test_cursor_continues_to_last_page(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            import_repository = self._seed_batches(database_url)
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                full = main.list_import_batches()
                first = _json_body(main.list_import_batches(limit=2))
                second = _json_body(
                    main.list_import_batches(limit=2, cursor=first["next_cursor"])
                )

        self.assertEqual(
            [item["batch_id"] for item in second["items"]],
            [row.batch_id for row in full.items[2:]],
        )
        self.assertEqual(second["total"], 3)
        self.assertIsNone(second["next_cursor"])

    def test_limit_above_max_is_clamped(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            import_repository = self._seed_batches(database_url)
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                page = main.list_import_batches(limit=999)

        body = _json_body(page)
        self.assertEqual(len(body["items"]), 3)
        self.assertIsNone(body["next_cursor"])

    def test_invalid_cursor_raises_400(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            import_repository = self._seed_batches(database_url)
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                with self.assertRaises(HTTPException) as context:
                    main.list_import_batches(limit=2, cursor="garbage")

        self.assertEqual(context.exception.status_code, 400)
        self.assertEqual(
            context.exception.detail["error"]["code"], "LIST_CURSOR_INVALID"
        )


class ReviewCaseListPaginationTest(unittest.TestCase):
    def _seed_cases(self, database_url: str, count: int) -> ReviewPersistenceRepository:
        source_ids = _seed_review_sources(database_url)
        repository = ReviewPersistenceRepository(database_url)
        repository.init_schema()
        for index in range(1, count + 1):
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id=f"CASE-PAGE-{index:04d}",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule_only"],
                    business_date="2026-05-11",
                    owner_id="supervisor-page",
                    severity="low",
                    status="open",
                )
            )
        return repository

    def test_default_response_is_unchanged_without_limit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            repository = self._seed_cases(database_url, 3)

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                response = main.list_review_cases_api()

        self.assertIsInstance(response, ReviewCaseListResponse)
        self.assertNotIsInstance(response, JSONResponse)
        self.assertEqual(list(response.model_dump(mode="json").keys()), ["items"])
        self.assertEqual(len(response.items), 3)

    def test_limit_above_max_is_clamped_to_200(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            repository = self._seed_cases(database_url, 201)

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                page = main.list_review_cases_api(limit=999)

        body = _json_body(page)
        self.assertEqual(len(body["items"]), 200)
        self.assertEqual(body["total"], 201)
        self.assertIsNotNone(body["next_cursor"])
        self.assertEqual(body["items"][0]["case_id"], "CASE-PAGE-0001")
        self.assertEqual(body["items"][-1]["case_id"], "CASE-PAGE-0200")

    def test_cursor_returns_remaining_rows_after_clamped_page(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            repository = self._seed_cases(database_url, 201)

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                first = _json_body(main.list_review_cases_api(limit=999))
                second = _json_body(
                    main.list_review_cases_api(limit=999, cursor=first["next_cursor"])
                )

        self.assertEqual(
            [item["case_id"] for item in second["items"]], ["CASE-PAGE-0201"]
        )
        self.assertEqual(second["total"], 201)
        self.assertIsNone(second["next_cursor"])


class MasterDataEmployeeListPaginationTest(unittest.TestCase):
    def _seed_employees(self, database_url: str) -> MasterDataPersistenceRepository:
        repository = MasterDataPersistenceRepository(database_url)
        repository.init_schema()
        repository.create_snapshot(
            MasterDataSnapshotRequest(
                batch_id="BATCH-PAGE-EMP",
                employees=[
                    EmployeeMasterDataInput(
                        employee_id=f"EMP-PAGE-{index:02d}",
                        employee_name=f"分页员工{index}",
                        status="active",
                        effective_from="2026-05-01",
                        effective_to="2026-12-31",
                    )
                    for index in range(1, 4)
                ],
            )
        )
        return repository

    def test_default_response_is_unchanged_without_limit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            repository = self._seed_employees(database_url)

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = main.list_master_data_employees()

        self.assertIsInstance(response, MasterDataEmployeeListResponse)
        self.assertNotIsInstance(response, JSONResponse)
        self.assertEqual(list(response.model_dump(mode="json").keys()), ["items"])
        self.assertEqual(len(response.items), 3)

    def test_limit_and_cursor_page_through_employees(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            repository = self._seed_employees(database_url)

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                full = main.list_master_data_employees()
                first = _json_body(main.list_master_data_employees(limit=2))
                second = _json_body(
                    main.list_master_data_employees(limit=2, cursor=first["next_cursor"])
                )

        self.assertEqual(
            [item["employee_id"] for item in first["items"]], ["EMP-PAGE-01", "EMP-PAGE-02"]
        )
        self.assertEqual(first["total"], 3)
        self.assertIsNotNone(first["next_cursor"])
        self.assertEqual(first["items"][1], full.items[1].model_dump(mode="json"))
        self.assertEqual(
            [item["employee_id"] for item in second["items"]], ["EMP-PAGE-03"]
        )
        self.assertEqual(second["total"], 3)
        self.assertIsNone(second["next_cursor"])


class ComparisonRunListPaginationTest(unittest.TestCase):
    def test_default_response_is_unchanged_without_limit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            _seed_review_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)

            with patch(
                "backend.app.main.ComparisonPersistenceRepository",
                return_value=repository,
            ):
                response = main.list_comparison_runs_api()

        self.assertIsInstance(response, ComparisonRunListResponse)
        self.assertNotIsInstance(response, JSONResponse)
        self.assertEqual(list(response.model_dump(mode="json").keys()), ["items"])
        self.assertEqual(len(response.items), 2)

    def test_limit_and_cursor_page_through_runs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'page.db'}"
            _seed_review_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)

            with patch(
                "backend.app.main.ComparisonPersistenceRepository",
                return_value=repository,
            ):
                first = _json_body(main.list_comparison_runs_api(limit=1))
                second = _json_body(
                    main.list_comparison_runs_api(limit=1, cursor=first["next_cursor"])
                )

        self.assertEqual([item["run_id"] for item in first["items"]], ["RUN-DB008-FS"])
        self.assertEqual(first["total"], 2)
        self.assertIsNotNone(first["next_cursor"])
        self.assertEqual([item["run_id"] for item in second["items"]], ["RUN-DB008-SA"])
        self.assertEqual(second["total"], 2)
        self.assertIsNone(second["next_cursor"])


if __name__ == "__main__":
    unittest.main()
