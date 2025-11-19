import express from 'express';
import db from '../db.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Add new category
router.post('/categories', upload.single('img'), async (req, res) => {
  try {
    const { name_en, name_ru, name_kg } = req.body;
    
    if (!name_en || !name_ru || !name_kg) {
      return res.status(400).json({ error: 'All language names are required' });
    }

    // Get the uploaded file path
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.execute(
      'INSERT INTO categories (name_en, name_ru, name_kg, img) VALUES (?, ?, ?, ?)',
      [name_en, name_ru, name_kg, imgPath]
    );
    
    res.json({ 
      id: result.insertId, 
      message: 'Category added successfully',
      category: { id: result.insertId, name_en, name_ru, name_kg, img: imgPath }
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new item
router.post('/items', upload.single('img'), async (req, res) => {
  try {
    const { 
      category_id, 
      title_en, 
      title_ru, 
      title_kg, 
      description, 
      ingredients, 
      price 
    } = req.body;

    if (!category_id || !title_en || !title_ru || !title_kg || !price) {
      return res.status(400).json({ error: 'Required fields: category_id, titles in all languages, and price' });
    }

    // Get the uploaded file path
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.execute(
      `INSERT INTO items 
      (category_id, title_en, title_ru, title_kg, description, ingredients, price, img) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, title_en, title_ru, title_kg, description || '', ingredients || '', price, imgPath]
    );
    
    res.json({ 
      id: result.insertId, 
      message: 'Item added successfully',
      item: { 
        id: result.insertId, 
        category_id, 
        title_en, 
        title_ru, 
        title_kg, 
        description, 
        ingredients, 
        price, 
        img: imgPath 
      }
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all categories (for admin)
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories for admin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all items (for admin)
router.get('/items', async (req, res) => {
  try {
    const [items] = await db.execute(`
      SELECT i.*, c.name_en as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.id 
      ORDER BY i.category_id, i.id
    `);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items for admin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM items WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: error.message });
  }
});


export default router;