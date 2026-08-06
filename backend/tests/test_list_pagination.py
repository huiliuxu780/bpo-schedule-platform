import unittest
from dataclasses import dataclass

from backend.app.list_pagination import (
    MAX_PAGE_LIMIT,
    ListCursorInvalidError,
    clamp_page_limit,
    decode_cursor,
    encode_cursor,
    paginate_sorted_rows,
)


@dataclass(frozen=True)
class _Row:
    uploaded_at: str
    batch_id: str


def _rows(*ids: str) -> list[_Row]:
    return [_Row(uploaded_at="2026-05-11T00:00:00", batch_id=batch_id) for batch_id in ids]


class ClampPageLimitTest(unittest.TestCase):
    def test_none_stays_none(self) -> None:
        self.assertIsNone(clamp_page_limit(None))

    def test_values_within_range_are_kept(self) -> None:
        self.assertEqual(clamp_page_limit(1), 1)
        self.assertEqual(clamp_page_limit(5), 5)
        self.assertEqual(clamp_page_limit(MAX_PAGE_LIMIT), MAX_PAGE_LIMIT)

    def test_values_above_range_are_clamped_to_max(self) -> None:
        self.assertEqual(clamp_page_limit(MAX_PAGE_LIMIT + 1), MAX_PAGE_LIMIT)
        self.assertEqual(clamp_page_limit(999), MAX_PAGE_LIMIT)

    def test_values_below_range_are_clamped_to_one(self) -> None:
        self.assertEqual(clamp_page_limit(0), 1)
        self.assertEqual(clamp_page_limit(-3), 1)


class CursorCodecTest(unittest.TestCase):
    def test_round_trip_preserves_components(self) -> None:
        values = ["2026-05-11T00:00:00", "BATCH-|特殊|001"]
        self.assertEqual(decode_cursor(encode_cursor(values), component_count=2), values)

    def test_invalid_cursor_shapes_raise(self) -> None:
        with self.assertRaises(ListCursorInvalidError):
            decode_cursor("not-json", component_count=1)
        with self.assertRaises(ListCursorInvalidError):
            decode_cursor('{"a":1}', component_count=1)
        with self.assertRaises(ListCursorInvalidError):
            decode_cursor('["only-one"]', component_count=2)
        with self.assertRaises(ListCursorInvalidError):
            decode_cursor('[123]', component_count=1)


class PaginateSortedRowsTest(unittest.TestCase):
    def test_first_page_returns_total_and_next_cursor(self) -> None:
        rows = _rows("A", "B", "C", "D", "E")

        page = paginate_sorted_rows(
            rows,
            limit=2,
            cursor=None,
            sort_key=lambda row: (row.batch_id,),
            directions=("asc",),
        )

        self.assertEqual([row.batch_id for row in page.items], ["A", "B"])
        self.assertEqual(page.total, 5)
        self.assertEqual(page.next_cursor, encode_cursor(("B",)))

    def test_cursor_continues_and_last_page_has_no_cursor(self) -> None:
        rows = _rows("A", "B", "C", "D", "E")
        sort_key = lambda row: (row.batch_id,)  # noqa: E731

        second = paginate_sorted_rows(
            rows, limit=2, cursor=encode_cursor(("B",)), sort_key=sort_key, directions=("asc",)
        )
        third = paginate_sorted_rows(
            rows,
            limit=2,
            cursor=second.next_cursor,
            sort_key=sort_key,
            directions=("asc",),
        )

        self.assertEqual([row.batch_id for row in second.items], ["C", "D"])
        self.assertEqual(second.total, 5)
        self.assertEqual([row.batch_id for row in third.items], ["E"])
        self.assertIsNone(third.next_cursor)

    def test_exact_last_page_has_no_next_cursor(self) -> None:
        rows = _rows("A", "B", "C", "D")
        sort_key = lambda row: (row.batch_id,)  # noqa: E731

        second = paginate_sorted_rows(
            rows, limit=2, cursor=encode_cursor(("B",)), sort_key=sort_key, directions=("asc",)
        )

        self.assertEqual([row.batch_id for row in second.items], ["C", "D"])
        self.assertIsNone(second.next_cursor)

    def test_desc_then_asc_directions_match_import_batch_ordering(self) -> None:
        rows = [
            _Row("2026-05-12T00:00:00", "BATCH-2"),
            _Row("2026-05-11T00:00:00", "BATCH-3"),
            _Row("2026-05-11T00:00:00", "BATCH-4"),
            _Row("2026-05-10T00:00:00", "BATCH-1"),
        ]
        sort_key = lambda row: (row.uploaded_at, row.batch_id)  # noqa: E731

        first = paginate_sorted_rows(
            rows, limit=2, cursor=None, sort_key=sort_key, directions=("desc", "asc")
        )
        second = paginate_sorted_rows(
            rows, limit=2, cursor=first.next_cursor, sort_key=sort_key, directions=("desc", "asc")
        )

        self.assertEqual(
            [row.batch_id for row in first.items], ["BATCH-2", "BATCH-3"]
        )
        self.assertEqual(
            [row.batch_id for row in second.items], ["BATCH-4", "BATCH-1"]
        )
        self.assertIsNone(second.next_cursor)

    def test_cursor_for_missing_row_still_resumes_by_key(self) -> None:
        rows = _rows("A", "C", "D")

        page = paginate_sorted_rows(
            rows,
            limit=10,
            cursor=encode_cursor(("B",)),
            sort_key=lambda row: (row.batch_id,),
            directions=("asc",),
        )

        self.assertEqual([row.batch_id for row in page.items], ["C", "D"])

    def test_cursor_on_last_row_returns_empty_page(self) -> None:
        rows = _rows("A", "B")

        page = paginate_sorted_rows(
            rows,
            limit=2,
            cursor=encode_cursor(("B",)),
            sort_key=lambda row: (row.batch_id,),
            directions=("asc",),
        )

        self.assertEqual(page.items, [])
        self.assertEqual(page.total, 2)
        self.assertIsNone(page.next_cursor)

    def test_empty_rows_yield_empty_page(self) -> None:
        page = paginate_sorted_rows(
            [],
            limit=5,
            cursor=None,
            sort_key=lambda row: (row.batch_id,),
            directions=("asc",),
        )

        self.assertEqual(page.items, [])
        self.assertEqual(page.total, 0)
        self.assertIsNone(page.next_cursor)

    def test_limit_larger_than_rows_returns_everything_without_cursor(self) -> None:
        rows = _rows("A", "B", "C")

        page = paginate_sorted_rows(
            rows,
            limit=MAX_PAGE_LIMIT,
            cursor=None,
            sort_key=lambda row: (row.batch_id,),
            directions=("asc",),
        )

        self.assertEqual(len(page.items), 3)
        self.assertIsNone(page.next_cursor)

    def test_invalid_cursor_raises(self) -> None:
        with self.assertRaises(ListCursorInvalidError):
            paginate_sorted_rows(
                _rows("A"),
                limit=1,
                cursor="garbage",
                sort_key=lambda row: (row.batch_id,),
                directions=("asc",),
            )


if __name__ == "__main__":
    unittest.main()
