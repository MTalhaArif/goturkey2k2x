export function slugifyUniversityName(name) {
  return name
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getUniversityBySlug(universities, slug) {
  return universities.find((u) => slugifyUniversityName(u.name) === slug) || null;
}
