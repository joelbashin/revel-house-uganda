const RULES: Array<[RegExp, string[]]> = [
  [/\b(child|welfare|protection|protect|foster|abuse|guardian|orphan)\b/i, ['Child Care & Protection', 'Child Protection']],
  [/\b(educat|literacy|school|learning|learn)\b/i, ['Education']],
  [/\b(health|medical|medic|nutrition|clinic|wellness)\b/i, ['Health & Medical Care']],
  [/\b(wash|water|hygiene|sanitation|sanit)\b/i, ['WASH & Hygiene']],
  [/\b(community|livelihood|outreach|economic|empowerment|income)\b/i, ['Community Outreach', 'Community Livelihoods']],
];

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function resolveCategoryImage(
  category: string | undefined,
  map: Record<string, string>,
  defaultKey?: string
): string {
  if (category) {
    const exact = normalize(category);
    for (const key of Object.keys(map)) {
      if (normalize(key) === exact) return map[key];
    }
  }

  const c = (category || '').toLowerCase();
  if (c) {
    for (const [re, keys] of RULES) {
      if (re.test(c)) {
        for (const key of keys) {
          if (map[key]) return map[key];
        }
      }
    }
  }

  if (defaultKey && map[defaultKey]) return map[defaultKey];
  const first = Object.keys(map)[0];
  return first ? map[first] : '';
}