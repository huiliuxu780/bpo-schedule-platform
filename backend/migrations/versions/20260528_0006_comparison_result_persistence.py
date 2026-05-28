"""create comparison result persistence tables

Revision ID: 20260528_0006
Revises: 20260528_0005
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0006"
down_revision: Union[str, None] = "20260528_0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "comparison_runs",
        sa.Column("run_id", sa.String(length=120), primary_key=True),
        sa.Column("comparison_type", sa.String(length=40), nullable=False),
        sa.Column("forecast_version_id", sa.String(length=120), nullable=True),
        sa.Column("schedule_version_id", sa.String(length=120), nullable=True),
        sa.Column("actual_import_version_id", sa.String(length=120), nullable=True),
        sa.Column("business_date_from", sa.String(length=20), nullable=False),
        sa.Column("business_date_to", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("total_results", sa.Integer(), nullable=False),
        sa.Column("total_gap_agents", sa.Integer(), nullable=True),
        sa.Column("total_late_minutes", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(
            ["forecast_version_id"],
            ["forecast_versions.forecast_version_id"],
        ),
        sa.ForeignKeyConstraint(
            ["schedule_version_id"],
            ["personnel_schedule_versions.schedule_version_id"],
        ),
        sa.ForeignKeyConstraint(["actual_import_version_id"], ["import_versions.version_id"]),
    )
    for column_name in [
        "forecast_version_id",
        "schedule_version_id",
        "actual_import_version_id",
    ]:
        op.create_index(
            f"ix_comparison_runs_{column_name}",
            "comparison_runs",
            [column_name],
        )

    op.create_table(
        "forecast_schedule_comparison_results",
        sa.Column("result_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("run_id", sa.String(length=120), nullable=False),
        sa.Column("forecast_version_id", sa.String(length=120), nullable=False),
        sa.Column("schedule_version_id", sa.String(length=120), nullable=False),
        sa.Column("forecast_interval_id", sa.String(length=160), nullable=True),
        sa.Column("schedule_detail_id", sa.String(length=160), nullable=True),
        sa.Column("business_date", sa.String(length=20), nullable=False),
        sa.Column("workplace_id", sa.String(length=80), nullable=False),
        sa.Column("project_id", sa.String(length=80), nullable=False),
        sa.Column("skill_id", sa.String(length=80), nullable=False),
        sa.Column("interval_start", sa.String(length=5), nullable=False),
        sa.Column("interval_end", sa.String(length=5), nullable=False),
        sa.Column("forecast_agents", sa.Integer(), nullable=False),
        sa.Column("scheduled_agents", sa.Integer(), nullable=False),
        sa.Column("gap_agents", sa.Integer(), nullable=False),
        sa.Column("result_status", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["run_id"], ["comparison_runs.run_id"]),
        sa.ForeignKeyConstraint(
            ["forecast_version_id"],
            ["forecast_versions.forecast_version_id"],
        ),
        sa.ForeignKeyConstraint(
            ["schedule_version_id"],
            ["personnel_schedule_versions.schedule_version_id"],
        ),
        sa.ForeignKeyConstraint(
            ["forecast_interval_id"],
            ["forecast_intervals.forecast_interval_id"],
        ),
        sa.ForeignKeyConstraint(
            ["schedule_detail_id"],
            ["personnel_schedule_details.schedule_detail_id"],
        ),
    )
    for column_name in [
        "run_id",
        "forecast_version_id",
        "schedule_version_id",
        "forecast_interval_id",
        "schedule_detail_id",
    ]:
        op.create_index(
            f"ix_forecast_schedule_comparison_results_{column_name}",
            "forecast_schedule_comparison_results",
            [column_name],
        )

    op.create_table(
        "schedule_actual_comparison_results",
        sa.Column("result_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("run_id", sa.String(length=120), nullable=False),
        sa.Column("schedule_version_id", sa.String(length=120), nullable=False),
        sa.Column("actual_import_version_id", sa.String(length=120), nullable=False),
        sa.Column("schedule_detail_id", sa.String(length=160), nullable=True),
        sa.Column("actual_status_interval_row_id", sa.Integer(), nullable=True),
        sa.Column("business_date", sa.String(length=20), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("interval_start", sa.String(length=5), nullable=False),
        sa.Column("interval_end", sa.String(length=5), nullable=False),
        sa.Column("scheduled_minutes", sa.Integer(), nullable=False),
        sa.Column("actual_productive_minutes", sa.Integer(), nullable=False),
        sa.Column("late_minutes", sa.Integer(), nullable=False),
        sa.Column("result_status", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["run_id"], ["comparison_runs.run_id"]),
        sa.ForeignKeyConstraint(
            ["schedule_version_id"],
            ["personnel_schedule_versions.schedule_version_id"],
        ),
        sa.ForeignKeyConstraint(["actual_import_version_id"], ["import_versions.version_id"]),
        sa.ForeignKeyConstraint(
            ["schedule_detail_id"],
            ["personnel_schedule_details.schedule_detail_id"],
        ),
        sa.ForeignKeyConstraint(
            ["actual_status_interval_row_id"],
            ["actual_status_intervals.interval_row_id"],
        ),
    )
    for column_name in [
        "run_id",
        "schedule_version_id",
        "actual_import_version_id",
        "schedule_detail_id",
        "actual_status_interval_row_id",
    ]:
        op.create_index(
            f"ix_schedule_actual_comparison_results_{column_name}",
            "schedule_actual_comparison_results",
            [column_name],
        )


def downgrade() -> None:
    for column_name in [
        "actual_status_interval_row_id",
        "schedule_detail_id",
        "actual_import_version_id",
        "schedule_version_id",
        "run_id",
    ]:
        op.drop_index(
            f"ix_schedule_actual_comparison_results_{column_name}",
            table_name="schedule_actual_comparison_results",
        )
    op.drop_table("schedule_actual_comparison_results")

    for column_name in [
        "schedule_detail_id",
        "forecast_interval_id",
        "schedule_version_id",
        "forecast_version_id",
        "run_id",
    ]:
        op.drop_index(
            f"ix_forecast_schedule_comparison_results_{column_name}",
            table_name="forecast_schedule_comparison_results",
        )
    op.drop_table("forecast_schedule_comparison_results")

    for column_name in [
        "actual_import_version_id",
        "schedule_version_id",
        "forecast_version_id",
    ]:
        op.drop_index(
            f"ix_comparison_runs_{column_name}",
            table_name="comparison_runs",
        )
    op.drop_table("comparison_runs")
