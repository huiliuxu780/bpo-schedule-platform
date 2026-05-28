"""create master data persistence tables

Revision ID: 20260528_0002
Revises: 20260528_0001
Create Date: 2026-05-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260528_0002"
down_revision: Union[str, None] = "20260528_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _create_reference_table(table_name: str, id_column: str, name_column: str) -> None:
    op.create_table(
        table_name,
        sa.Column(id_column, sa.String(length=80), primary_key=True),
        sa.Column(name_column, sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
    )


def upgrade() -> None:
    _create_reference_table("master_data_suppliers", "supplier_id", "supplier_name")
    _create_reference_table("master_data_workplaces", "workplace_id", "workplace_name")
    _create_reference_table("master_data_projects", "project_id", "project_name")
    _create_reference_table("master_data_skills", "skill_id", "skill_name")
    _create_reference_table("master_data_employees", "employee_id", "employee_name")
    op.create_table(
        "master_data_employee_bindings",
        sa.Column("binding_id", sa.String(length=120), primary_key=True),
        sa.Column("employee_id", sa.String(length=80), nullable=False),
        sa.Column("supplier_id", sa.String(length=80), nullable=False),
        sa.Column("workplace_id", sa.String(length=80), nullable=False),
        sa.Column("project_id", sa.String(length=80), nullable=False),
        sa.Column("skill_id", sa.String(length=80), nullable=False),
        sa.Column("effective_from", sa.String(length=20), nullable=False),
        sa.Column("effective_to", sa.String(length=20), nullable=False),
        sa.Column("batch_id", sa.String(length=80), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["import_batches.batch_id"]),
        sa.ForeignKeyConstraint(["employee_id"], ["master_data_employees.employee_id"]),
        sa.ForeignKeyConstraint(["supplier_id"], ["master_data_suppliers.supplier_id"]),
        sa.ForeignKeyConstraint(["workplace_id"], ["master_data_workplaces.workplace_id"]),
        sa.ForeignKeyConstraint(["project_id"], ["master_data_projects.project_id"]),
        sa.ForeignKeyConstraint(["skill_id"], ["master_data_skills.skill_id"]),
    )
    op.create_index(
        "ix_master_data_employee_bindings_employee_id",
        "master_data_employee_bindings",
        ["employee_id"],
    )
    op.create_index(
        "ix_master_data_employee_bindings_supplier_id",
        "master_data_employee_bindings",
        ["supplier_id"],
    )
    op.create_index(
        "ix_master_data_employee_bindings_workplace_id",
        "master_data_employee_bindings",
        ["workplace_id"],
    )
    op.create_index(
        "ix_master_data_employee_bindings_project_id",
        "master_data_employee_bindings",
        ["project_id"],
    )
    op.create_index(
        "ix_master_data_employee_bindings_skill_id",
        "master_data_employee_bindings",
        ["skill_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_master_data_employee_bindings_skill_id",
        table_name="master_data_employee_bindings",
    )
    op.drop_index(
        "ix_master_data_employee_bindings_project_id",
        table_name="master_data_employee_bindings",
    )
    op.drop_index(
        "ix_master_data_employee_bindings_workplace_id",
        table_name="master_data_employee_bindings",
    )
    op.drop_index(
        "ix_master_data_employee_bindings_supplier_id",
        table_name="master_data_employee_bindings",
    )
    op.drop_index(
        "ix_master_data_employee_bindings_employee_id",
        table_name="master_data_employee_bindings",
    )
    op.drop_table("master_data_employee_bindings")
    op.drop_table("master_data_employees")
    op.drop_table("master_data_skills")
    op.drop_table("master_data_projects")
    op.drop_table("master_data_workplaces")
    op.drop_table("master_data_suppliers")
