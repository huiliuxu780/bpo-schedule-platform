"""add roster request result type

Revision ID: 20260708_0015
Revises: 20260707_0014
Create Date: 2026-07-08
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260708_0015"
down_revision: Union[str, None] = "20260707_0014"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "roster_request_intents",
        sa.Column("result_type", sa.String(length=40), nullable=True),
    )
    op.create_index(
        "ix_roster_request_intents_result_type",
        "roster_request_intents",
        ["result_type"],
    )


def downgrade() -> None:
    op.drop_index("ix_roster_request_intents_result_type", table_name="roster_request_intents")
    op.drop_column("roster_request_intents", "result_type")
