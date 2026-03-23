function normalizeArabicText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/[\u0640]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  normalizeArabicText,
};
