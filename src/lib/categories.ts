// To add a new category: add a line here, then use its key in an artwork's `category:`.
export const CATEGORIES = {
  illustration: { label: 'Illustration', color: 'var(--yellow)' },
  'character-design': { label: 'Character Design', color: 'var(--hot)' },
  'graphic-design': { label: 'Graphic Design', color: 'var(--mint)' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];
