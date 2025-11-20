class TranslationService {
  constructor() {
    this.cache = new Map();
  }

  async translateText(text, targetLang, sourceLang = 'en') {
    if (!text || text.trim() === '' || targetLang === 'en') return text;

    // Check cache first
    const cacheKey = `${text}-${sourceLang}-${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const translatedText = data[0].map(item => item[0]).join('');

      this.cache.set(cacheKey, translatedText);

      console.log(`✓ Translated: "${text}" -> "${translatedText}"`);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async translateMultiple(texts, targetLang, sourceLang = 'en') {
    const translations = [];
    for (const text of texts) {
      const translated = await this.translateText(text, targetLang, sourceLang);
      translations.push(translated);
    }
    return translations;
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new TranslationService();