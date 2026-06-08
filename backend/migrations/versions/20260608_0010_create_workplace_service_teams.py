"""create workplace service team master data table

Revision ID: 20260608_0010
Revises: 20260604_0009
Create Date: 2026-06-08
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260608_0010"
down_revision: Union[str, None] = "20260604_0009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "master_data_workplace_service_teams",
        sa.Column("service_team_id", sa.String(length=120), primary_key=True),
        sa.Column("workplace_id", sa.String(length=80), nullable=False),
        sa.Column("team_type", sa.String(length=30), nullable=False),
        sa.Column("team_name", sa.String(length=255), nullable=False),
        sa.Column("organization_id", sa.String(length=80), nullable=True),
        sa.Column("supplier_id", sa.String(length=80), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
        sa.ForeignKeyConstraint(["workplace_id"], ["master_data_workplaces.workplace_id"]),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["master_data_organizations.organization_id"],
        ),
        sa.ForeignKeyConstraint(["supplier_id"], ["master_data_suppliers.supplier_id"]),
    )
    op.create_index(
        "ix_master_data_workplace_service_teams_workplace_id",
        "master_data_workplace_service_teams",
        ["workplace_id"],
    )
    op.create_index(
        "ix_master_data_workplace_service_teams_organization_id",
        "master_data_workplace_service_teams",
        ["organization_id"],
    )
    op.create_index(
        "ix_master_data_workplace_service_teams_supplier_id",
        "master_data_workplace_service_teams",
        ["supplier_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_master_data_workplace_service_teams_supplier_id",
        table_name="master_data_workplace_service_teams",
    )
    op.drop_index(
        "ix_master_data_workplace_service_teams_organization_id",
        table_name="master_data_workplace_service_teams",
    )
    op.drop_index(
        "ix_master_data_workplace_service_teams_workplace_id",
        table_name="master_data_workplace_service_teams",
    )
    op.drop_table("master_data_workplace_service_teams")
