"""add roster request issue resolution note

Revision ID: 20260707_0013
Revises: 20260706_0012
Create Date: 2026-07-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260707_0013"
down_revision: Union[str, None] = "20260706_0012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "roster_request_intents",
        sa.Column("scheduler_resolution_note", sa.String(length=1000), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("roster_request_intents", "scheduler_resolution_note")

