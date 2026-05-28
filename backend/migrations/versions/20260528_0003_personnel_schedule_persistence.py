"""create personnel schedule persistence tables

Revision ID: 20260528_0003
Revises: 20260528_0002
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0003"
down_revision: Union[str, None] = "20260528_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "schedule_shift_types",
        sa.Column("shift_type_id", sa.String(length=80), primary_key=True),
        sa.Column("shift_type_name", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("start_time", sa.String(length=5), nullable=False),
        sa.Column("end_time", sa.String(length=5), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("import_version_id", sa.String(length=120), nullable=False),
        sa.ForeignKeyConstraint(["import_version_id"], ["import_versions.version_id"]),
    )
    op.create_table(
        "personnel_schedule_versions",
        sa.Column("schedule_version_id", sa.String(length=120), primary_key=True),
        sa.Column("import_version_id", sa.String(length=120), nullable=False),
        sa.Column("business_date_from", sa.String(length=20), nullable=False),
        sa.Column("business_date_to", sa.String(length=20), nullable=False),
        sa.Column("total_details", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["import_version_id"], ["import_versions.version_id"]),
    )
    op.create_table(
        "personnel_schedule_details",
        sa.Column("schedule_detail_id", sa.String(length=160), primary_key=True),
        sa.Column("schedule_version_id", sa.String(length=120), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("workplace_id", sa.String(length=80), nullable=False),
        sa.Column("project_id", sa.String(length=80), nullable=False),
        sa.Column("skill_id", sa.String(length=80), nullable=False),
        sa.Column("shift_type_id", sa.String(length=80), nullable=False),
        sa.Column("schedule_date", sa.String(length=20), nullable=False),
        sa.Column("start_time", sa.String(length=5), nullable=False),
        sa.Column("end_time", sa.String(length=5), nullable=False),
        sa.ForeignKeyConstraint(
            ["schedule_version_id"],
            ["personnel_schedule_versions.schedule_version_id"],
        ),
        sa.ForeignKeyConstraint(["employee_id"], ["master_data_employees.employee_id"]),
        sa.ForeignKeyConstraint(["workplace_id"], ["master_data_workplaces.workplace_id"]),
        sa.ForeignKeyConstraint(["project_id"], ["master_data_projects.project_id"]),
        sa.ForeignKeyConstraint(["skill_id"], ["master_data_skills.skill_id"]),
        sa.ForeignKeyConstraint(["shift_type_id"], ["schedule_shift_types.shift_type_id"]),
    )
    for column_name in [
        "schedule_version_id",
        "employee_id",
        "workplace_id",
        "project_id",
        "skill_id",
        "shift_type_id",
    ]:
        op.create_index(
            f"ix_personnel_schedule_details_{column_name}",
            "personnel_schedule_details",
            [column_name],
        )
    op.create_table(
        "personnel_schedule_intervals",
        sa.Column("interval_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("schedule_detail_id", sa.String(length=160), nullable=False),
        sa.Column("schedule_version_id", sa.String(length=120), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("interval_date", sa.String(length=20), nullable=False),
        sa.Column("interval_start", sa.String(length=5), nullable=False),
        sa.Column("interval_end", sa.String(length=5), nullable=False),
        sa.ForeignKeyConstraint(
            ["schedule_detail_id"],
            ["personnel_schedule_details.schedule_detail_id"],
        ),
        sa.ForeignKeyConstraint(
            ["schedule_version_id"],
            ["personnel_schedule_versions.schedule_version_id"],
        ),
        sa.ForeignKeyConstraint(["employee_id"], ["master_data_employees.employee_id"]),
    )
    for column_name in ["schedule_detail_id", "schedule_version_id", "employee_id"]:
        op.create_index(
            f"ix_personnel_schedule_intervals_{column_name}",
            "personnel_schedule_intervals",
            [column_name],
        )


def downgrade() -> None:
    for column_name in ["employee_id", "schedule_version_id", "schedule_detail_id"]:
        op.drop_index(
            f"ix_personnel_schedule_intervals_{column_name}",
            table_name="personnel_schedule_intervals",
        )
    op.drop_table("personnel_schedule_intervals")
    for column_name in [
        "shift_type_id",
        "skill_id",
        "project_id",
        "workplace_id",
        "employee_id",
        "schedule_version_id",
    ]:
        op.drop_index(
            f"ix_personnel_schedule_details_{column_name}",
            table_name="personnel_schedule_details",
        )
    op.drop_table("personnel_schedule_details")
    op.drop_table("personnel_schedule_versions")
    op.drop_table("schedule_shift_types")
