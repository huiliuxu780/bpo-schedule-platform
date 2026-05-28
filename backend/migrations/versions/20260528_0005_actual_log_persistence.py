"""create actual log persistence tables

Revision ID: 20260528_0005
Revises: 20260528_0004
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0005"
down_revision: Union[str, None] = "20260528_0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "actual_login_events",
        sa.Column("event_id", sa.String(length=160), primary_key=True),
        sa.Column("import_version_id", sa.String(length=120), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("event_type", sa.String(length=20), nullable=False),
        sa.Column("event_at", sa.String(length=40), nullable=False),
        sa.Column("timezone", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["import_version_id"], ["import_versions.version_id"]),
        sa.ForeignKeyConstraint(["employee_id"], ["master_data_employees.employee_id"]),
    )
    op.create_index(
        "ix_actual_login_events_import_version_id",
        "actual_login_events",
        ["import_version_id"],
    )
    op.create_index(
        "ix_actual_login_events_employee_id",
        "actual_login_events",
        ["employee_id"],
    )
    op.create_table(
        "actual_status_dictionary",
        sa.Column("external_status_code", sa.String(length=80), primary_key=True),
        sa.Column("normalized_status", sa.String(length=80), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("is_productive", sa.Boolean(), nullable=False),
    )
    op.create_table(
        "actual_status_intervals",
        sa.Column("interval_row_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("source_interval_id", sa.String(length=160), nullable=False),
        sa.Column("import_version_id", sa.String(length=120), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("business_date", sa.String(length=20), nullable=False),
        sa.Column("interval_start", sa.String(length=5), nullable=False),
        sa.Column("interval_end", sa.String(length=5), nullable=False),
        sa.Column("timezone", sa.String(length=40), nullable=False),
        sa.Column("external_status_code", sa.String(length=80), nullable=False),
        sa.Column("normalized_status", sa.String(length=80), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("is_productive", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["import_version_id"], ["import_versions.version_id"]),
        sa.ForeignKeyConstraint(["employee_id"], ["master_data_employees.employee_id"]),
        sa.ForeignKeyConstraint(
            ["external_status_code"],
            ["actual_status_dictionary.external_status_code"],
        ),
    )
    for column_name in ["import_version_id", "employee_id", "external_status_code"]:
        op.create_index(
            f"ix_actual_status_intervals_{column_name}",
            "actual_status_intervals",
            [column_name],
        )


def downgrade() -> None:
    for column_name in ["external_status_code", "employee_id", "import_version_id"]:
        op.drop_index(
            f"ix_actual_status_intervals_{column_name}",
            table_name="actual_status_intervals",
        )
    op.drop_table("actual_status_intervals")
    op.drop_table("actual_status_dictionary")
    op.drop_index(
        "ix_actual_login_events_employee_id",
        table_name="actual_login_events",
    )
    op.drop_index(
        "ix_actual_login_events_import_version_id",
        table_name="actual_login_events",
    )
    op.drop_table("actual_login_events")
