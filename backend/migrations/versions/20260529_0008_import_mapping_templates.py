"""create import field mapping template table

Revision ID: 20260529_0008
Revises: 20260528_0007
Create Date: 2026-05-29
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260529_0008"
down_revision: Union[str, None] = "20260528_0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "import_field_mapping_templates",
        sa.Column("template_id", sa.String(length=120), primary_key=True),
        sa.Column("template_name", sa.String(length=255), nullable=False),
        sa.Column("file_type", sa.String(length=80), nullable=False),
        sa.Column("field_mapping", sa.JSON(), nullable=False),
        sa.Column("created_by", sa.String(length=120), nullable=False),
        sa.Column("created_at", sa.String(length=40), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
    )
    op.create_index(
        "ix_import_field_mapping_templates_file_type",
        "import_field_mapping_templates",
        ["file_type"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_import_field_mapping_templates_file_type",
        table_name="import_field_mapping_templates",
    )
    op.drop_table("import_field_mapping_templates")
