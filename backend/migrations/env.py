from logging.config import fileConfig
import os

from alembic import context
from sqlalchemy import engine_from_config, pool

from backend.app.import_persistence import Base
from backend.app import actual_log_persistence  # noqa: F401
from backend.app import comparison_persistence  # noqa: F401
from backend.app import forecast_persistence  # noqa: F401
from backend.app import master_data_persistence  # noqa: F401
from backend.app import personnel_schedule_persistence  # noqa: F401
from backend.app import review_persistence  # noqa: F401
from backend.app import rule_config  # noqa: F401
from backend.app import schedule_period  # noqa: F401
from backend.app import shift_definition  # noqa: F401
from backend.app import status_mapping  # noqa: F401

config = context.config

if config.config_file_name is not None:
    # Keep application loggers (backend.app.*) enabled: fileConfig defaults to
    # disabling every pre-existing logger, which would silence request
    # correlation logs after migrations run in-process.
    fileConfig(config.config_file_name, disable_existing_loggers=False)

target_metadata = Base.metadata


def get_url() -> str:
    return os.environ.get(
        "BPO_DATABASE_URL",
        config.get_main_option("sqlalchemy.url"),
    )


def run_migrations_offline() -> None:
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
