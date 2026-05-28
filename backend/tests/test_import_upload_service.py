import unittest

from backend.app.import_upload import build_import_batch_from_csv


class ImportUploadServiceTest(unittest.TestCase):
    def test_csv_mapping_builds_success_rows_and_default_version(self) -> None:
        request = build_import_batch_from_csv(
            batch_id="BATCH-UPLOAD-001",
            file_name="personnel_schedule_20260511.csv",
            file_type="personnel_schedule",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            csv_text="员工编号,班次\nA-1001,MORNING\nA-1002,NIGHT\n",
            field_mapping={"员工编号": "source_key", "班次": "shift_type_id"},
        )

        self.assertEqual(request.batch_id, "BATCH-UPLOAD-001")
        self.assertEqual(request.file_type, "personnel_schedule")
        self.assertEqual(len(request.rows), 2)
        self.assertEqual(request.rows[0].row_status, "success")
        self.assertEqual(request.rows[0].source_key, "A-1001")
        self.assertIsNone(request.rows[0].error_code)
        self.assertEqual(
            request.rows[0].raw_data["standard_fields"],
            {"source_key": "A-1001", "shift_type_id": "MORNING"},
        )
        self.assertEqual(
            request.rows[0].raw_data["original_columns"],
            {"员工编号": "A-1001", "班次": "MORNING"},
        )
        self.assertEqual(len(request.versions), 1)
        self.assertEqual(request.versions[0].version_id, "BATCH-UPLOAD-001::v1")
        self.assertEqual(request.versions[0].version_type, "personnel_schedule")

    def test_missing_source_key_builds_failed_row(self) -> None:
        request = build_import_batch_from_csv(
            batch_id="BATCH-UPLOAD-002",
            file_name="personnel_schedule_20260511.csv",
            file_type="personnel_schedule",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            csv_text="员工编号,班次\n,MORNING\n",
            field_mapping={"员工编号": "source_key", "班次": "shift_type_id"},
        )

        self.assertEqual(len(request.rows), 1)
        self.assertEqual(request.rows[0].row_status, "failed")
        self.assertIsNone(request.rows[0].source_key)
        self.assertEqual(request.rows[0].error_field, "source_key")
        self.assertEqual(request.rows[0].error_code, "REQUIRED_FIELD_MISSING")
        self.assertIn("source_key", request.rows[0].error_message or "")
        self.assertEqual(
            request.rows[0].raw_data["standard_fields"],
            {"source_key": "", "shift_type_id": "MORNING"},
        )

    def test_empty_csv_or_missing_header_raises_clear_value_error(self) -> None:
        common_kwargs = {
            "batch_id": "BATCH-UPLOAD-003",
            "file_name": "empty.csv",
            "file_type": "personnel_schedule",
            "uploaded_by": "数据管理员",
            "business_date_from": "2026-05-11",
            "business_date_to": "2026-05-11",
            "field_mapping": {"员工编号": "source_key"},
        }

        with self.assertRaisesRegex(ValueError, "CSV 内容为空或缺少表头"):
            build_import_batch_from_csv(csv_text="", **common_kwargs)

        with self.assertRaisesRegex(ValueError, "CSV 内容为空或缺少表头"):
            build_import_batch_from_csv(csv_text="\n\n", **common_kwargs)


if __name__ == "__main__":
    unittest.main()
