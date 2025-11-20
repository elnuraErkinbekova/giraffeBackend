import express from 'express';
import db from '../db.js';
import translationService from '../services/translationService.js';

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(categories[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/items/:categoryId', async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const [items] = await db.execute(
      'SELECT * FROM items WHERE category_id = ? ORDER BY id',
      [req.params.categoryId]
    );

    // Use pre-translated fields from database (no real-time translation needed)
    const localizedItems = items.map(item => {
      const localizedItem = {
        id: item.id,
        category_id: item.category_id,
        img: item.img,
        // Use the pre-translated titles from database
        title: item[`title_${lang}`] || item.title_en,
        // Use pre-translated descriptions
        description: item[`description_${lang}`] || item.description_en,
        // Use pre-translated ingredients
        ingredients: item[`ingredients_${lang}`] || item.ingredients_en,
        // Use pre-translated prices
        price: item[`price_${lang}`] || item.price_en
      };

      return localizedItem;
    });

    res.json(localizedItems);

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/items', async (req, res) => {
  try {
    const [items] = await db.execute('SELECT * FROM items ORDER BY category_id, id');
    res.json(items);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLang, sourceLang = 'en' } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    const translatedText = await translationService.translateText(text, targetLang, sourceLang);

    res.json({
      originalText: text,
      translatedText: translatedText,
      sourceLang: sourceLang,
      targetLang: targetLang
    });
  } catch (error) {
    console.error('Translation endpoint error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

export default router;