"""schedule core: periods, matrix, publications, shifts, rules, status mappings

Revision ID: 20260804_0011
Revises: 20260608_0010
Create Date: 2026-08-04
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260804_0011"
down_revision: Union[str, None] = "20260608_0010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 组1：排班周期与员工×日期矩阵单元格
    op.create_table(
        "schedule_periods",
        sa.Column("period_id", sa.String(length=120), primary_key=True),
        sa.Column("month", sa.String(length=7), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("date_from", sa.String(length=20), nullable=False),
        sa.Column("date_to", sa.String(length=20), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("weeks_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.Column("updated_at", sa.String(length=40), nullable=False),
    )
    op.create_index("ix_schedule_periods_month", "schedule_periods", ["month"])
    op.create_table(
        "schedule_matrix_cells",
        sa.Column(
            "period_id",
            sa.String(length=120),
            sa.ForeignKey("schedule_periods.period_id"),
            primary_key=True,
        ),
        sa.Column("employee_id", sa.String(length=80), primary_key=True),
        sa.Column("schedule_date", sa.String(length=20), primary_key=True),
        sa.Column("segments_json", sa.JSON(), nullable=False),
        sa.Column(
            "locked",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.Column("updated_at", sa.String(length=40), nullable=False),
    )

    # 组2：发布版本、版本快照单元格、发布记录与技能系数快照
    op.create_table(
        "schedule_period_versions",
        sa.Column("version_id", sa.String(length=160), primary_key=True),
        sa.Column("period_id", sa.String(length=120), nullable=False),
        sa.Column("publication_id", sa.String(length=160), nullable=False),
        sa.Column("org_scope", sa.String(length=120), nullable=False),
        sa.Column("date_from", sa.String(length=20), nullable=False),
        sa.Column("date_to", sa.String(length=20), nullable=False),
        sa.Column("note", sa.String(length=500), nullable=True),
        sa.Column("published_at", sa.String(length=40), nullable=False),
        sa.Column("cell_count", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["period_id"], ["schedule_periods.period_id"]),
    )
    op.create_index(
        "ix_schedule_period_versions_period_id",
        "schedule_period_versions",
        ["period_id"],
    )
    op.create_table(
        "schedule_version_cells",
        sa.Column("cell_row_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("version_id", sa.String(length=160), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("schedule_date", sa.String(length=20), nullable=False),
        sa.Column("segments_json", sa.JSON(), nullable=False),
        sa.Column(
            "locked",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.ForeignKeyConstraint(
            ["version_id"], ["schedule_period_versions.version_id"]
        ),
    )
    op.create_index(
        "ix_schedule_version_cells_version_id",
        "schedule_version_cells",
        ["version_id"],
    )
    op.create_table(
        "schedule_publications",
        sa.Column("publication_id", sa.String(length=160), primary_key=True),
        sa.Column("period_id", sa.String(length=120), nullable=False),
        sa.Column("version_id", sa.String(length=160), nullable=False),
        sa.Column("org_scope", sa.String(length=120), nullable=False),
        sa.Column("date_from", sa.String(length=20), nullable=False),
        sa.Column("date_to", sa.String(length=20), nullable=False),
        sa.Column("note", sa.String(length=500), nullable=True),
        sa.Column("published_at", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["period_id"], ["schedule_periods.period_id"]),
    )
    op.create_index(
        "ix_schedule_publications_period_id",
        "schedule_publications",
        ["period_id"],
    )
    op.create_table(
        "schedule_skill_coefficient_snapshots",
        sa.Column("snapshot_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("publication_id", sa.String(length=160), nullable=False),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("skill_id", sa.String(length=80), nullable=False),
        sa.Column("coefficient", sa.Float(), nullable=False),
        sa.Column("default_source", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(
            ["publication_id"], ["schedule_publications.publication_id"]
        ),
    )
    op.create_index(
        "ix_schedule_skill_coefficient_snapshots_publication_id",
        "schedule_skill_coefficient_snapshots",
        ["publication_id"],
    )

    # 组3：班次定义（版本化，变更产生新版本不覆写历史）
    op.create_table(
        "shift_definitions",
        sa.Column("shift_definition_id", sa.String(length=200), primary_key=True),
        sa.Column("shift_code", sa.String(length=80), nullable=False),
        sa.Column("version_number", sa.Integer(), nullable=False),
        sa.Column("shift_name", sa.String(length=255), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("segments_json", sa.JSON(), nullable=False),
        sa.Column(
            "is_cross_day",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.Column(
            "night_attribution",
            sa.String(length=20),
            nullable=False,
            server_default="start_date",
        ),
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="active",
        ),
        sa.Column("created_at", sa.String(length=40), nullable=False),
    )
    op.create_index(
        "ix_shift_definitions_shift_code", "shift_definitions", ["shift_code"]
    )

    # 组4：规则配置（scheduling/attendance/publish，scope + 有效期）
    op.create_table(
        "scheduling_rule_configs",
        sa.Column("rule_id", sa.String(length=200), primary_key=True),
        sa.Column("category", sa.String(length=30), nullable=False),
        sa.Column("scope_type", sa.String(length=20), nullable=False),
        sa.Column("scope_id", sa.String(length=80), nullable=True),
        sa.Column("fields_json", sa.JSON(), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("default_source", sa.String(length=255), nullable=False),
        sa.Column("updated_at", sa.String(length=40), nullable=False),
    )
    op.create_index(
        "ix_scheduling_rule_configs_category",
        "scheduling_rule_configs",
        ["category"],
    )

    # 组5：状态映射（status/sub_status/status_cd → 业务活动 + 口径开关）
    op.create_table(
        "status_activity_mappings",
        sa.Column("status", sa.String(length=80), primary_key=True),
        sa.Column("sub_status", sa.String(length=80), primary_key=True),
        sa.Column("status_cd", sa.String(length=80), primary_key=True),
        sa.Column("activity_code", sa.String(length=80), nullable=False),
        sa.Column("activity_name", sa.String(length=255), nullable=False),
        sa.Column("counts_attendance", sa.Boolean(), nullable=False),
        sa.Column("counts_valid_hours", sa.Boolean(), nullable=False),
        sa.Column("counts_production_hours", sa.Boolean(), nullable=False),
        sa.Column("counts_coverage", sa.Boolean(), nullable=False),
        sa.Column("counts_rest", sa.Boolean(), nullable=False),
        sa.Column("counts_punctuality", sa.Boolean(), nullable=False),
    )

    # 组6：员工排班限制扩展列
    op.add_column(
        "master_data_employees",
        sa.Column(
            "night_shift_allowed",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("1"),
        ),
    )
    op.add_column(
        "master_data_employees",
        sa.Column(
            "cross_day_allowed",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("1"),
        ),
    )
    op.add_column(
        "master_data_employees",
        sa.Column(
            "unavailable_dates",
            sa.JSON(),
            nullable=False,
            server_default="[]",
        ),
    )


def downgrade() -> None:
    op.drop_column("master_data_employees", "unavailable_dates")
    op.drop_column("master_data_employees", "cross_day_allowed")
    op.drop_column("master_data_employees", "night_shift_allowed")
    op.drop_table("status_activity_mappings")
    op.drop_index(
        "ix_scheduling_rule_configs_category",
        table_name="scheduling_rule_configs",
    )
    op.drop_table("scheduling_rule_configs")
    op.drop_index("ix_shift_definitions_shift_code", table_name="shift_definitions")
    op.drop_table("shift_definitions")
    op.drop_index(
        "ix_schedule_skill_coefficient_snapshots_publication_id",
        table_name="schedule_skill_coefficient_snapshots",
    )
    op.drop_table("schedule_skill_coefficient_snapshots")
    op.drop_index(
        "ix_schedule_publications_period_id", table_name="schedule_publications"
    )
    op.drop_table("schedule_publications")
    op.drop_index(
        "ix_schedule_version_cells_version_id", table_name="schedule_version_cells"
    )
    op.drop_table("schedule_version_cells")
    op.drop_index(
        "ix_schedule_period_versions_period_id",
        table_name="schedule_period_versions",
    )
    op.drop_table("schedule_period_versions")
    op.drop_table("schedule_matrix_cells")
    op.drop_index("ix_schedule_periods_month", table_name="schedule_periods")
    op.drop_table("schedule_periods")
