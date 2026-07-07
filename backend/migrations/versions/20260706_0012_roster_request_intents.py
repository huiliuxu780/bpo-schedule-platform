"""create roster request intent table

Revision ID: 20260706_0012
Revises: 20260704_0011
Create Date: 2026-07-06
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260706_0012"
down_revision: Union[str, None] = "20260704_0011"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "roster_request_intents",
        sa.Column("request_id", sa.String(length=160), primary_key=True),
        sa.Column("business_month", sa.String(length=7), nullable=False),
        sa.Column("project_id", sa.String(length=120), nullable=False),
        sa.Column("workplace_id", sa.String(length=120), nullable=False),
        sa.Column("team_id", sa.String(length=120), nullable=False),
        sa.Column("roster_version_id", sa.String(length=120), nullable=False),
        sa.Column("roster_cell_id", sa.String(length=160), nullable=False),
        sa.Column("employee_id", sa.String(length=120), nullable=False),
        sa.Column("business_date", sa.String(length=20), nullable=False),
        sa.Column("action_type", sa.String(length=40), nullable=False),
        sa.Column("requester_role", sa.String(length=40), nullable=False),
        sa.Column("requester_id", sa.String(length=120), nullable=False),
        sa.Column("note", sa.String(length=1000), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.Column("resolved_at", sa.String(length=40), nullable=True),
        sa.Column("resolved_by", sa.String(length=120), nullable=True),
        sa.Column("linked_revision_version_id", sa.String(length=120), nullable=True),
        sa.ForeignKeyConstraint(["roster_version_id"], ["roster_versions.roster_version_id"]),
    )
    op.create_index(
        "ix_roster_request_intents_business_month",
        "roster_request_intents",
        ["business_month"],
    )
    op.create_index(
        "ix_roster_request_intents_roster_version_id",
        "roster_request_intents",
        ["roster_version_id"],
    )
    op.create_index(
        "ix_roster_request_intents_roster_cell_id",
        "roster_request_intents",
        ["roster_cell_id"],
    )
    op.create_index(
        "ix_roster_request_intents_employee_id",
        "roster_request_intents",
        ["employee_id"],
    )
    op.create_index(
        "ix_roster_request_intents_business_date",
        "roster_request_intents",
        ["business_date"],
    )
    op.create_index(
        "ix_roster_request_intents_status",
        "roster_request_intents",
        ["status"],
    )


def downgrade() -> None:
    op.drop_index("ix_roster_request_intents_status", table_name="roster_request_intents")
    op.drop_index(
        "ix_roster_request_intents_business_date",
        table_name="roster_request_intents",
    )
    op.drop_index(
        "ix_roster_request_intents_employee_id",
        table_name="roster_request_intents",
    )
    op.drop_index(
        "ix_roster_request_intents_roster_cell_id",
        table_name="roster_request_intents",
    )
    op.drop_index(
        "ix_roster_request_intents_roster_version_id",
        table_name="roster_request_intents",
    )
    op.drop_index(
        "ix_roster_request_intents_business_month",
        table_name="roster_request_intents",
    )
    op.drop_table("roster_request_intents")
