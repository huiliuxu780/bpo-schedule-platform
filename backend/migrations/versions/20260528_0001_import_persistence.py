"""create import persistence tables

Revision ID: 20260528_0001
Revises: None
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "import_batches",
        sa.Column("batch_id", sa.String(length=80), primary_key=True),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_type", sa.String(length=80), nullable=False),
        sa.Column("uploaded_by", sa.String(length=120), nullable=False),
        sa.Column("uploaded_at", sa.String(length=40), nullable=False),
        sa.Column("business_date_from", sa.String(length=20), nullable=False),
        sa.Column("business_date_to", sa.String(length=20), nullable=False),
        sa.Column("processing_status", sa.String(length=40), nullable=False),
        sa.Column("total_rows", sa.Integer(), nullable=False),
        sa.Column("success_rows", sa.Integer(), nullable=False),
        sa.Column("failed_rows", sa.Integer(), nullable=False),
        sa.Column("warning_rows", sa.Integer(), nullable=False),
    )
    op.create_table(
        "import_row_results",
        sa.Column("row_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.Column("row_number", sa.Integer(), nullable=False),
        sa.Column("row_status", sa.String(length=20), nullable=False),
        sa.Column("source_key", sa.String(length=255), nullable=True),
        sa.Column("error_field", sa.String(length=120), nullable=True),
        sa.Column("error_code", sa.String(length=120), nullable=True),
        sa.Column("error_message", sa.String(length=500), nullable=True),
        sa.Column("raw_data", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
    )
    op.create_index(
        "ix_import_row_results_batch_id",
        "import_row_results",
        ["batch_id"],
    )
    op.create_table(
        "import_versions",
        sa.Column("version_id", sa.String(length=120), primary_key=True),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.Column("version_type", sa.String(length=80), nullable=False),
        sa.Column("business_date_from", sa.String(length=20), nullable=False),
        sa.Column("business_date_to", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
    )
    op.create_index("ix_import_versions_batch_id", "import_versions", ["batch_id"])


def downgrade() -> None:
    op.drop_index("ix_import_versions_batch_id", table_name="import_versions")
    op.drop_table("import_versions")
    op.drop_index("ix_import_row_results_batch_id", table_name="import_row_results")
    op.drop_table("import_row_results")
    op.drop_table("import_batches")
