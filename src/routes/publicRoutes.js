import express from 'express';
import db from '../db.js';

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
router.get('/items/:categoryId', async (req, res) => {
  try {
    const [items] = await db.execute(
      'SELECT * FROM items WHERE category_id = ? ORDER BY id',
      [req.params.categoryId]
    );
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
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

export default router;