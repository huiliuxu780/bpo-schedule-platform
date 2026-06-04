"""extend master data organization and skill model

Revision ID: 20260604_0009
Revises: 20260529_0008
Create Date: 2026-06-04
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260604_0009"
down_revision: Union[str, None] = "20260529_0008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "master_data_skills",
        sa.Column("skill_category", sa.String(length=30), nullable=True),
    )
    op.add_column(
        "master_data_employees",
        sa.Column(
            "employee_type",
            sa.String(length=30),
            nullable=False,
            server_default="internal",
        ),
    )
    op.add_column(
        "master_data_employees",
        sa.Column("organization_id", sa.String(length=80), nullable=True),
    )
    op.add_column(
        "master_data_employees",
        sa.Column("workplace_id", sa.String(length=80), nullable=True),
    )
    op.create_index(
        "ix_master_data_employees_organization_id",
        "master_data_employees",
        ["organization_id"],
    )
    op.create_index(
        "ix_master_data_employees_workplace_id",
        "master_data_employees",
        ["workplace_id"],
    )
    op.create_table(
        "master_data_organizations",
        sa.Column("organization_id", sa.String(length=80), primary_key=True),
        sa.Column("organization_name", sa.String(length=255), nullable=False),
        sa.Column("organization_level", sa.Integer(), nullable=False),
        sa.Column("parent_organization_id", sa.String(length=80), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
        sa.ForeignKeyConstraint(
            ["parent_organization_id"],
            ["master_data_organizations.organization_id"],
        ),
    )
    op.create_index(
        "ix_master_data_organizations_parent_organization_id",
        "master_data_organizations",
        ["parent_organization_id"],
    )
    op.create_table(
        "master_data_employee_skills",
        sa.Column("employee_id", sa.String(length=80), primary_key=True),
        sa.Column("skill_id", sa.String(length=80), primary_key=True),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
        sa.ForeignKeyConstraint(["employee_id"], ["master_data_employees.employee_id"]),
        sa.ForeignKeyConstraint(["skill_id"], ["master_data_skills.skill_id"]),
    )
    op.create_index(
        "ix_master_data_employee_skills_employee_id",
        "master_data_employee_skills",
        ["employee_id"],
    )
    op.create_index(
        "ix_master_data_employee_skills_skill_id",
        "master_data_employee_skills",
        ["skill_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_master_data_employee_skills_skill_id",
        table_name="master_data_employee_skills",
    )
    op.drop_index(
        "ix_master_data_employee_skills_employee_id",
        table_name="master_data_employee_skills",
    )
    op.drop_table("master_data_employee_skills")
    op.drop_index(
        "ix_master_data_organizations_parent_organization_id",
        table_name="master_data_organizations",
    )
    op.drop_table("master_data_organizations")
    op.drop_index(
        "ix_master_data_employees_workplace_id",
        table_name="master_data_employees",
    )
    op.drop_index(
        "ix_master_data_employees_organization_id",
        table_name="master_data_employees",
    )
    op.drop_column("master_data_employees", "workplace_id")
    op.drop_column("master_data_employees", "organization_id")
    op.drop_column("master_data_employees", "employee_type")
    op.drop_column("master_data_skills", "skill_category")
