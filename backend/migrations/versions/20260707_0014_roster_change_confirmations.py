"""create roster change confirmation table

Revision ID: 20260707_0014
Revises: 20260707_0013
Create Date: 2026-07-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260707_0014"
down_revision: Union[str, None] = "20260707_0013"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "roster_change_confirmations",
        sa.Column("change_event_id", sa.String(length=240), nullable=False),
        sa.Column("business_month", sa.String(length=7), nullable=False),
        sa.Column("project_id", sa.String(length=120), nullable=False),
        sa.Column("workplace_id", sa.String(length=120), nullable=False),
        sa.Column("team_id", sa.String(length=120), nullable=False),
        sa.Column("confirmed_by", sa.String(length=120), nullable=False),
        sa.Column("confirmed_at", sa.String(length=40), nullable=False),
        sa.Column("internal_confirmation_note", sa.String(length=1000), nullable=False),
        sa.PrimaryKeyConstraint("change_event_id"),
    )
    op.create_index(
        "ix_roster_change_confirmations_business_month",
        "roster_change_confirmations",
        ["business_month"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_roster_change_confirmations_business_month",
        table_name="roster_change_confirmations",
    )
    op.drop_table("roster_change_confirmations")
