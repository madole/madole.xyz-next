/**
 * Tag identity lives here.
 *
 * Tags are hand-written in frontmatter, so the same topic turns up as
 * "Javascript", "javascript" and "js", with spaces, capitals and punctuation.
 * A tag's slug - its page path and the target of every link to it - has to come
 * from one place. When the generated path and the link normalise differently,
 * the link 404s on a case-sensitive host, which is exactly what three copies of
 * this logic used to do.
 */

/** URL slug for a tag: lowercase, hyphenated, stripped to [a-z0-9-]. */
export function normaliseTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagItem {
  /** The tag as written in frontmatter, for display. */
  name: string;
  /** Its normalised slug, for the page path and links. */
  slug: string;
}

/**
 * Sanitises frontmatter tags into display names and slugs.
 *
 * A blank `tags:` line and any non-string junk are dropped rather than becoming
 * a `/tag/undefined` page, and duplicates collapse by slug so "Javascript" and
 * "javascript" yield one entry.
 */
export function tagItems(tags: unknown): TagItem[] {
  const list = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",")
      : [];

  const seen = new Set<string>();
  const items: TagItem[] = [];
  for (const value of list) {
    if (typeof value !== "string") continue;
    const name = value.trim();
    const slug = normaliseTag(name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    items.push({ name, slug });
  }
  return items;
}
