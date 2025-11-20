import express from 'express';
import db from '../db.js';
import translationService from '../services/translationService.js';

const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single category
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

// Get items by category ID
// Get items by category ID (with optional translation)
router.get('/items/:categoryId', async (req, res) => {
  try {
    const lang = req.query.lang || "en";  // frontend should send ?lang=en/ru/kg

    const [items] = await db.execute(
      'SELECT * FROM items WHERE category_id = ? ORDER BY id',
      [req.params.categoryId]
    );

    // Translate description + ingredients ONLY
    const translatedItems = await Promise.all(
      items.map(async (item) => {
        const updatedItem = { ...item };

        if (item.description) {
          updatedItem.description = await translationService.translateText(
            item.description,
            lang,
            "en"
          );
        }

        if (item.ingredients) {
          updatedItem.ingredients = await translationService.translateText(
            item.ingredients,
            lang,
            "en"
          );
        }

        // DO NOT translate title/category/price
        return updatedItem;
      })
    );

    res.json(translatedItems);

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get all items (for testing)
router.get('/items', async (req, res) => {
  try {
    const [items] = await db.execute('SELECT * FROM items ORDER BY category_id, id');
    res.json(items);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ error: error.message });
  }
});

// Translation endpoint
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