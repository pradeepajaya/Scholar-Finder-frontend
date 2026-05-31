export function normalizeSearchTerm(term: string) {
  return term.trim().toLowerCase();
}

function searchableValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(searchableValues);
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [String(value).toLowerCase()];
}

export function matchesSearch(term: string, values: unknown[]) {
  const normalizedTerm = normalizeSearchTerm(term);

  if (!normalizedTerm) {
    return true;
  }

  return values
    .flatMap(searchableValues)
    .some((value) => value.includes(normalizedTerm));
}
