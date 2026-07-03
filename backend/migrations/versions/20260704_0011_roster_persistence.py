"""create roster draft published persistence tables

Revision ID: 20260704_0011
Revises: 20260608_0010
Create Date: 2026-07-04
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260704_0011"
down_revision: Union[str, None] = "20260608_0010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "roster_versions",
        sa.Column("roster_version_id", sa.String(length=120), primary_key=True),
        sa.Column("business_month", sa.String(length=7), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("version_type", sa.String(length=40), nullable=False),
        sa.Column("project_id", sa.String(length=120), nullable=False),
        sa.Column("workplace_id", sa.String(length=120), nullable=False),
        sa.Column("team_id", sa.String(length=120), nullable=False),
        sa.Column("effective_at", sa.String(length=40), nullable=True),
        sa.Column("parent_version_id", sa.String(length=120), nullable=True),
        sa.Column("supersedes_version_id", sa.String(length=120), nullable=True),
        sa.Column("activated_at", sa.String(length=40), nullable=True),
        sa.Column("activation_failed_reason", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.Column("updated_at", sa.String(length=40), nullable=False),
    )
    op.create_index("ix_roster_versions_business_month", "roster_versions", ["business_month"])
    op.create_index("ix_roster_versions_status", "roster_versions", ["status"])
    op.create_index(
        "uq_roster_versions_active_draft_scope_month",
        "roster_versions",
        ["business_month", "project_id", "workplace_id", "team_id"],
        unique=True,
        sqlite_where=sa.text("status = 'draft'"),
    )
    op.create_index(
        "uq_roster_versions_current_published_scope_month",
        "roster_versions",
        ["business_month", "project_id", "workplace_id", "team_id"],
        unique=True,
        sqlite_where=sa.text("status = 'published'"),
    )
    op.create_index(
        "uq_roster_versions_scheduled_published_scope_month",
        "roster_versions",
        ["business_month", "project_id", "workplace_id", "team_id"],
        unique=True,
        sqlite_where=sa.text("status = 'scheduled_published'"),
    )

    op.create_table(
        "roster_cells",
        sa.Column("roster_cell_id", sa.String(length=160), primary_key=True),
        sa.Column("roster_version_id", sa.String(length=120), nullable=False),
        sa.Column("assignment_id", sa.String(length=160), nullable=False),
        sa.Column("employee_id", sa.String(length=120), nullable=False),
        sa.Column("business_date", sa.String(length=20), nullable=False),
        sa.Column("sequence", sa.Integer(), nullable=False),
        sa.Column("assignment_kind", sa.String(length=40), nullable=False),
        sa.Column("project_id", sa.String(length=120), nullable=False),
        sa.Column("workplace_id", sa.String(length=120), nullable=False),
        sa.Column("team_id", sa.String(length=120), nullable=False),
        sa.Column("shift_code", sa.String(length=80), nullable=True),
        sa.Column("annotation_code", sa.String(length=120), nullable=True),
        sa.Column("interval_start_at", sa.String(length=40), nullable=True),
        sa.Column("interval_end_at", sa.String(length=40), nullable=True),
        sa.Column("source_cell_id", sa.String(length=160), nullable=True),
        sa.Column("manually_adjusted", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["roster_version_id"], ["roster_versions.roster_version_id"]),
        sa.UniqueConstraint(
            "roster_version_id",
            "employee_id",
            "business_date",
            "sequence",
            name="uq_roster_cells_version_employee_date_sequence",
        ),
    )
    op.create_index("ix_roster_cells_roster_version_id", "roster_cells", ["roster_version_id"])
    op.create_index("ix_roster_cells_employee_id", "roster_cells", ["employee_id"])
    op.create_index("ix_roster_cells_business_date", "roster_cells", ["business_date"])

    op.create_table(
        "roster_version_events",
        sa.Column("event_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("roster_version_id", sa.String(length=120), nullable=False),
        sa.Column("action", sa.String(length=80), nullable=False),
        sa.Column("actor_id", sa.String(length=120), nullable=False),
        sa.Column("occurred_at", sa.String(length=40), nullable=False),
        sa.Column("note", sa.String(length=1000), nullable=True),
        sa.ForeignKeyConstraint(["roster_version_id"], ["roster_versions.roster_version_id"]),
    )
    op.create_index(
        "ix_roster_version_events_roster_version_id",
        "roster_version_events",
        ["roster_version_id"],
    )

    op.create_table(
        "roster_cell_change_logs",
        sa.Column("change_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("roster_version_id", sa.String(length=120), nullable=False),
        sa.Column("roster_cell_id", sa.String(length=160), nullable=True),
        sa.Column("actor_id", sa.String(length=120), nullable=False),
        sa.Column("occurred_at", sa.String(length=40), nullable=False),
        sa.Column("change_type", sa.String(length=80), nullable=False),
        sa.Column("before_data", sa.JSON(), nullable=True),
        sa.Column("after_data", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(["roster_version_id"], ["roster_versions.roster_version_id"]),
    )
    op.create_index(
        "ix_roster_cell_change_logs_roster_version_id",
        "roster_cell_change_logs",
        ["roster_version_id"],
    )

    op.create_table(
        "roster_published_snapshots",
        sa.Column("roster_version_id", sa.String(length=120), primary_key=True),
        sa.Column("shift_counts", sa.JSON(), nullable=False),
        sa.Column("arranged_coverage", sa.JSON(), nullable=False),
        sa.Column("hard_errors", sa.JSON(), nullable=False),
        sa.Column("soft_risks", sa.JSON(), nullable=False),
        sa.Column("diff_summary", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["roster_version_id"], ["roster_versions.roster_version_id"]),
    )

    op.create_table(
        "roster_edit_locks",
        sa.Column("roster_version_id", sa.String(length=120), primary_key=True),
        sa.Column("actor_id", sa.String(length=120), nullable=False),
        sa.Column("acquired_at", sa.String(length=40), nullable=False),
        sa.Column("expires_at", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["roster_version_id"], ["roster_versions.roster_version_id"]),
    )


def downgrade() -> None:
    op.drop_table("roster_edit_locks")
    op.drop_table("roster_published_snapshots")
    op.drop_index(
        "ix_roster_cell_change_logs_roster_version_id",
        table_name="roster_cell_change_logs",
    )
    op.drop_table("roster_cell_change_logs")
    op.drop_index(
        "ix_roster_version_events_roster_version_id",
        table_name="roster_version_events",
    )
    op.drop_table("roster_version_events")
    op.drop_index("ix_roster_cells_business_date", table_name="roster_cells")
    op.drop_index("ix_roster_cells_employee_id", table_name="roster_cells")
    op.drop_index("ix_roster_cells_roster_version_id", table_name="roster_cells")
    op.drop_table("roster_cells")
    op.drop_index(
        "uq_roster_versions_scheduled_published_scope_month",
        table_name="roster_versions",
    )
    op.drop_index(
        "uq_roster_versions_current_published_scope_month",
        table_name="roster_versions",
    )
    op.drop_index(
        "uq_roster_versions_active_draft_scope_month",
        table_name="roster_versions",
    )
    op.drop_index("ix_roster_versions_status", table_name="roster_versions")
    op.drop_index("ix_roster_versions_business_month", table_name="roster_versions")
    op.drop_table("roster_versions")
