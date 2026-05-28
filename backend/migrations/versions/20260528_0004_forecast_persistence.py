"""create forecast persistence tables

Revision ID: 20260528_0004
Revises: 20260528_0003
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0004"
down_revision: Union[str, None] = "20260528_0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "forecast_versions",
        sa.Column("forecast_version_id", sa.String(length=120), primary_key=True),
        sa.Column("import_version_id", sa.String(length=120), nullable=False),
        sa.Column("business_date_from", sa.String(length=20), nullable=False),
        sa.Column("business_date_to", sa.String(length=20), nullable=False),
        sa.Column("total_intervals", sa.Integer(), nullable=False),
        sa.Column("total_required_agents", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["import_version_id"], ["import_versions.version_id"]),
    )
    op.create_table(
        "forecast_intervals",
        sa.Column("forecast_interval_id", sa.String(length=160), primary_key=True),
        sa.Column("forecast_version_id", sa.String(length=120), nullable=False),
        sa.Column("forecast_date", sa.String(length=20), nullable=False),
        sa.Column("interval_start", sa.String(length=5), nullable=False),
        sa.Column("interval_end", sa.String(length=5), nullable=False),
        sa.Column("workplace_id", sa.String(length=80), nullable=False),
        sa.Column("project_id", sa.String(length=80), nullable=False),
        sa.Column("skill_id", sa.String(length=80), nullable=False),
        sa.Column("demand_level", sa.String(length=40), nullable=False),
        sa.Column("required_agents", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["forecast_version_id"], ["forecast_versions.forecast_version_id"]),
        sa.ForeignKeyConstraint(["workplace_id"], ["master_data_workplaces.workplace_id"]),
        sa.ForeignKeyConstraint(["project_id"], ["master_data_projects.project_id"]),
        sa.ForeignKeyConstraint(["skill_id"], ["master_data_skills.skill_id"]),
    )
    for column_name in ["forecast_version_id", "workplace_id", "project_id", "skill_id"]:
        op.create_index(
            f"ix_forecast_intervals_{column_name}",
            "forecast_intervals",
            [column_name],
        )
    op.create_table(
        "forecast_version_changes",
        sa.Column("change_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("forecast_version_id", sa.String(length=120), nullable=False),
        sa.Column("compared_from_version_id", sa.String(length=120), nullable=True),
        sa.Column("change_reason", sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(["forecast_version_id"], ["forecast_versions.forecast_version_id"]),
    )
    op.create_index(
        "ix_forecast_version_changes_forecast_version_id",
        "forecast_version_changes",
        ["forecast_version_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_forecast_version_changes_forecast_version_id",
        table_name="forecast_version_changes",
    )
    op.drop_table("forecast_version_changes")
    for column_name in ["skill_id", "project_id", "workplace_id", "forecast_version_id"]:
        op.drop_index(
            f"ix_forecast_intervals_{column_name}",
            table_name="forecast_intervals",
        )
    op.drop_table("forecast_intervals")
    op.drop_table("forecast_versions")
