"""Idempotency regression tests for the lazy sqlite schema initialization.

Covers the concurrent-first-request race where two connections both pass the
check-first inspection and issue the same CREATE TABLE/ALTER TABLE DDL.
"""

import tempfile
import threading
import unittest
from pathlib import Path

from sqlalchemy import inspect as inspect_schema

from backend.app.import_persistence import build_engine
from backend.app.master_data_persistence import (
    MasterDataPersistenceRepository,
    _ensure_sqlite_master_data_schema,
)


class SqliteSchemaIdempotencyTests(unittest.TestCase):
    def test_sequential_double_initialization_is_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite:///{Path(directory) / 'schema.db'}"
            engine = build_engine(database_url)

            _ensure_sqlite_master_data_schema(engine)
            _ensure_sqlite_master_data_schema(engine)

            inspector = inspect_schema(engine)
            self.assertIn("master_data_employees", inspector.get_table_names())
            engine.dispose()

    def test_initialization_skips_preexisting_tables(self):
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite:///{Path(directory) / 'schema.db'}"
            engine = build_engine(database_url)

            # 模拟另一连接已先建好部分表：check-first 必须跳过而非重复 CREATE。
            from backend.app.import_persistence import Base

            Base.metadata.create_all(engine)
            _ensure_sqlite_master_data_schema(engine)

            inspector = inspect_schema(engine)
            employee_columns = {
                column["name"]
                for column in inspector.get_columns("master_data_employees")
            }
            self.assertIn("employee_type", employee_columns)
            self.assertIn("night_shift_allowed", employee_columns)
            engine.dispose()

    def test_concurrent_first_initialization_does_not_raise(self):
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite:///{Path(directory) / 'schema.db'}"
            barrier = threading.Barrier(8)
            errors: list[BaseException] = []

            def initialize() -> None:
                try:
                    barrier.wait(timeout=10)
                    engine = build_engine(database_url)
                    _ensure_sqlite_master_data_schema(engine)
                    engine.dispose()
                except BaseException as exc:  # pragma: no cover - failure path
                    errors.append(exc)

            threads = [threading.Thread(target=initialize) for _ in range(8)]
            for thread in threads:
                thread.start()
            for thread in threads:
                thread.join(timeout=30)

            self.assertEqual(errors, [])
            engine = build_engine(database_url)
            inspector = inspect_schema(engine)
            self.assertIn("master_data_employees", inspector.get_table_names())
            engine.dispose()

    def test_repository_construction_is_race_safe(self):
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite:///{Path(directory) / 'schema.db'}"
            barrier = threading.Barrier(4)
            errors: list[BaseException] = []

            def construct() -> None:
                try:
                    barrier.wait(timeout=10)
                    MasterDataPersistenceRepository(database_url)
                except BaseException as exc:  # pragma: no cover - failure path
                    errors.append(exc)

            threads = [threading.Thread(target=construct) for _ in range(4)]
            for thread in threads:
                thread.start()
            for thread in threads:
                thread.join(timeout=30)

            self.assertEqual(errors, [])


if __name__ == "__main__":
    unittest.main()
