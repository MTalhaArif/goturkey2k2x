export function filterUniversities(universities, { term = '', privateOnly = true } = {}) {
  const q = term.trim().toLowerCase();

  return universities.filter((u) => {
    if (privateOnly && u.type !== 'Foundation') return false;
    if (!q) return true;

    const nameMatch = u.name.toLowerCase().includes(q);
    const cityMatch = u.city.toLowerCase().includes(q);
    const programMatch = u.programs.some((p) => p.toLowerCase().includes(q));
    return nameMatch || cityMatch || programMatch;
  });
}
