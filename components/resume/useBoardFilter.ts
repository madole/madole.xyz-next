import { useEffect, useState } from "react";

/*
 * Filters the board by card text.
 *
 * The cards are arbitrary JSX rather than data, so there is no list to
 * filter in React. Instead this reads the rendered text of each card and
 * hides the ones that do not match, then hides any column left with no
 * visible cards. Matching is done in the DOM for the same reason.
 *
 * `matches` reports how many cards are showing so the caller can tell the
 * user when a search finds nothing.
 */
export function useBoardFilter(boardSelector: string) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<number | null>(null);

  useEffect(() => {
    const board = document.querySelector(boardSelector);
    if (!board) return;

    const cards = Array.from(
      board.querySelectorAll<HTMLElement>("[data-card]"),
    );
    const columns = Array.from(
      board.querySelectorAll<HTMLElement>("[data-column]"),
    );
    const needle = query.trim().toLowerCase();

    if (!needle) {
      cards.forEach((card) => card.removeAttribute("hidden"));
      columns.forEach((column) => column.removeAttribute("hidden"));
      setMatches(null);
      return;
    }

    let visible = 0;
    cards.forEach((card) => {
      const hit = (card.textContent ?? "").toLowerCase().includes(needle);
      card.toggleAttribute("hidden", !hit);
      if (hit) visible += 1;
    });

    /*
      A column whose title matches stays open even when none of its cards do,
      so searching "achievements" still shows you where to look.
    */
    columns.forEach((column) => {
      const title = (column.dataset.column ?? "").toLowerCase();
      const hasVisibleCard = Array.from(
        column.querySelectorAll<HTMLElement>("[data-card]"),
      ).some((card) => !card.hasAttribute("hidden"));
      column.toggleAttribute(
        "hidden",
        !hasVisibleCard && !title.includes(needle),
      );
    });

    setMatches(visible);
  }, [query, boardSelector]);

  return { query, setQuery, matches };
}
