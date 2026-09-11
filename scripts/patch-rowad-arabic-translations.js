const fs = require('fs');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..');

const replacements = [
  ['الدرجة المطلوبة لاجتياز المساق', 'الدرجة المطلوبة لاجتياز الدورة'],
  ['جميع تواريخ المساق', 'جميع تواريخ الدورة'],
  ['أدوات المساق', 'أدوات الدورة'],
  ['نشرات المساق', 'نشرات الدورة'],
  ['استأنف المساق', 'استأنف الدورة'],
  ['اعرض المساق', 'اعرض الدورة'],
  ['عرض المساق', 'اعرض الدورة'],
  ['انتهى المساق', 'انتهت الدورة'],
  ['ينتهي المساق', 'تنتهي الدورة'],
  ['هذا المساق', 'هذه الدورة'],
  ['المساق الجديد', 'الدورة الجديدة'],
  ['المساق الحالي', 'الدورة الحالية'],
  ['مساق جديد', 'دورة جديدة'],
  ['مساق واحد', 'دورة واحدة'],
  ['إبحث عن مساق', 'ابحث عن دورة'],
  ['ابحث عن مساق', 'ابحث عن دورة'],
  ['مساقاتي', 'دوراتي'],
  ['المساق', 'الدورة'],
  ['مساق', 'دورة'],
];

const candidates = [];

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
      continue;
    }

    const filename = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(filename);
      continue;
    }

    const basename = entry.name.toLowerCase();
    const normalized = filename.replace(/\\/g, '/').toLowerCase();

    if (
      /^ar(?:[-_][a-z0-9-]+)?\.json$/.test(basename)
      || normalized.includes('/ar/messages/')
    ) {
      candidates.push(filename);
    }
  }
}

function replaceArabic(value) {
  if (Array.isArray(value)) {
    return value.map(replaceArabic);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, replaceArabic(child)]),
    );
  }

  if (typeof value !== 'string') {
    return value;
  }

  return replacements.reduce(
    (result, [before, after]) => result.split(before).join(after),
    value,
  );
}

walk(path.join(repositoryRoot, 'src'));
walk(path.join(repositoryRoot, 'translations'));

let changed = 0;

for (const filename of candidates) {
  const original = fs.readFileSync(filename, 'utf8');
  const parsed = JSON.parse(original);
  const updated = `${JSON.stringify(replaceArabic(parsed), null, 2)}\n`;

  if (updated !== original) {
    fs.writeFileSync(filename, updated);
    changed += 1;
    console.log(`ROWAD: updated ${path.relative(repositoryRoot, filename)}`);
  }
}

console.log(
  `ROWAD: checked ${candidates.length} Arabic translation file(s); changed ${changed}.`,
);
