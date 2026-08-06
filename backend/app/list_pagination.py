"""Shared keyset pagination support for high-frequency list endpoints.

List endpoints keep their default behavior untouched: pagination only kicks
in when the caller explicitly passes ``limit``. Cursors are keyset-based
(sort-key of the last row on the previous page, JSON-encoded), so paging does
not degrade with deep offsets.
"""

from __future__ import annotations

import json
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any, TypeVar

T = TypeVar("T")

MAX_PAGE_LIMIT = 200


class ListCursorInvalidError(ValueError):
    """Raised when a pagination cursor cannot be decoded."""


@dataclass(frozen=True)
class ListPage:
    items: list[Any]
    total: int
    next_cursor: str | None


def clamp_page_limit(limit: int | None) -> int | None:
    """Clamp an optional page size into ``[1, MAX_PAGE_LIMIT]``.

    ``None`` stays ``None`` so callers can keep the legacy full-list behavior.
    """
    if limit is None:
        return None
    return max(1, min(limit, MAX_PAGE_LIMIT))


def encode_cursor(values: Sequence[str]) -> str:
    return json.dumps(list(values), ensure_ascii=False)


def decode_cursor(cursor: str, *, component_count: int) -> list[str]:
    try:
        values = json.loads(cursor)
    except json.JSONDecodeError as exc:
        raise ListCursorInvalidError(cursor) from exc
    if (
        not isinstance(values, list)
        or len(values) != component_count
        or any(not isinstance(value, str) for value in values)
    ):
        raise ListCursorInvalidError(cursor)
    return values


def paginate_sorted_rows(
    rows: Sequence[T],
    *,
    limit: int,
    cursor: str | None,
    sort_key: Callable[[T], tuple[str, ...]],
    directions: tuple[str, ...],
) -> ListPage:
    """Page already-sorted ``rows`` with keyset semantics.

    ``sort_key`` returns the stable sort-key components of a row and must
    match the repository ordering described by ``directions`` (one of
    ``"asc"``/``"desc"`` per component). ``cursor`` marks the last row of the
    previous page; that row itself is excluded. Rows referenced by a cursor
    that no longer exist do not break paging, because positions are compared
    by key instead of by lookup.

    ``total`` always counts every filtered row, independent of ``cursor``,
    while ``next_cursor`` is ``None`` when no further row remains.
    """
    if cursor is not None:
        cursor_key = decode_cursor(cursor, component_count=len(directions))
        remaining_rows = [
            row for row in rows if _is_after_cursor(sort_key(row), cursor_key, directions)
        ]
    else:
        remaining_rows = list(rows)

    page = remaining_rows[:limit]
    next_cursor = (
        encode_cursor(sort_key(page[-1])) if len(remaining_rows) > len(page) else None
    )
    return ListPage(items=page, total=len(rows), next_cursor=next_cursor)


def _is_after_cursor(
    key: tuple[str, ...],
    cursor_key: Sequence[str],
    directions: tuple[str, ...],
) -> bool:
    for value, reference, direction in zip(key, cursor_key, directions, strict=True):
        if value == reference:
            continue
        return value > reference if direction == "asc" else value < reference
    return False
