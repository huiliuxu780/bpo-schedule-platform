"""create review closure persistence tables

Revision ID: 20260528_0007
Revises: 20260528_0006
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0007"
down_revision: Union[str, None] = "20260528_0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "review_cases",
        sa.Column("case_id", sa.String(length=120), primary_key=True),
        sa.Column("source_result_type", sa.String(length=40), nullable=False),
        sa.Column("source_result_id", sa.Integer(), nullable=False),
        sa.Column("business_date", sa.String(length=20), nullable=False),
        sa.Column("owner_id", sa.String(length=120), nullable=False),
        sa.Column("severity", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.String(length=40), nullable=False),
    )
    for column_name in ["source_result_type", "source_result_id", "owner_id"]:
        op.create_index(
            f"ix_review_cases_{column_name}",
            "review_cases",
            [column_name],
        )

    op.create_table(
        "review_evidence",
        sa.Column("evidence_id", sa.String(length=120), primary_key=True),
        sa.Column("case_id", sa.String(length=120), nullable=False),
        sa.Column("evidence_type", sa.String(length=80), nullable=False),
        sa.Column("evidence_uri", sa.String(length=500), nullable=False),
        sa.Column("submitted_by", sa.String(length=120), nullable=False),
        sa.Column("submitted_at", sa.String(length=40), nullable=False),
        sa.Column("note", sa.String(length=1000), nullable=True),
        sa.ForeignKeyConstraint(["case_id"], ["review_cases.case_id"]),
    )
    op.create_index("ix_review_evidence_case_id", "review_evidence", ["case_id"])

    op.create_table(
        "review_conclusions",
        sa.Column("conclusion_id", sa.String(length=120), primary_key=True),
        sa.Column("case_id", sa.String(length=120), nullable=False),
        sa.Column("conclusion_type", sa.String(length=80), nullable=False),
        sa.Column("risk_level", sa.String(length=40), nullable=False),
        sa.Column("conclusion_text", sa.String(length=1000), nullable=False),
        sa.Column("decided_by", sa.String(length=120), nullable=False),
        sa.Column("decided_at", sa.String(length=40), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["review_cases.case_id"]),
    )
    op.create_index(
        "ix_review_conclusions_case_id",
        "review_conclusions",
        ["case_id"],
    )

    op.create_table(
        "review_closures",
        sa.Column("closure_id", sa.String(length=120), primary_key=True),
        sa.Column("case_id", sa.String(length=120), nullable=False),
        sa.Column("closure_status", sa.String(length=40), nullable=False),
        sa.Column("closed_by", sa.String(length=120), nullable=False),
        sa.Column("closed_at", sa.String(length=40), nullable=False),
        sa.Column("closure_note", sa.String(length=1000), nullable=True),
        sa.ForeignKeyConstraint(["case_id"], ["review_cases.case_id"]),
        sa.UniqueConstraint("case_id", name="uq_review_closures_case_id"),
    )
    op.create_index("ix_review_closures_case_id", "review_closures", ["case_id"])


def downgrade() -> None:
    op.drop_index("ix_review_closures_case_id", table_name="review_closures")
    op.drop_table("review_closures")
    op.drop_index("ix_review_conclusions_case_id", table_name="review_conclusions")
    op.drop_table("review_conclusions")
    op.drop_index("ix_review_evidence_case_id", table_name="review_evidence")
    op.drop_table("review_evidence")
    for column_name in ["owner_id", "source_result_id", "source_result_type"]:
        op.drop_index(f"ix_review_cases_{column_name}", table_name="review_cases")
    op.drop_table("review_cases")
