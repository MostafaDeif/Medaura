const en = require("./locales/en.json");
const ar = require("./locales/ar.json");

export const locales = {
  en,
  ar,
};

export function t(key, locale = "en") {
  const parts = key.split(".");
  let cur = locales[locale];
  for (const p of parts) {
    if (!cur) return key;
    cur = cur[p];
  }
  return cur ?? key;
}
