/** Builds an ILIKE pattern, escaping LIKE wildcards typed by the user. */
export const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, '\\$&')}%`;
