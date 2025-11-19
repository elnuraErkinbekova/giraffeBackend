import db from "../db.js";

export const getItemsByCategory = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM items WHERE category_id = ?", [id]);
  res.json(rows);
};

export const addItem = async (req, res) => {
  const { category_id, title_en, title_ru, title_kg, description, ingredients, price } = req.body;
  const img = req.file ? req.file.path : null;

  const [result] = await db.query(
    `INSERT INTO items
     (category_id, title_en, title_ru, title_kg, description, ingredients, price, img)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [category_id, title_en, title_ru, title_kg, description, ingredients, price, img]
  );

  res.json({ id: result.insertId, message: "Item added" });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM items WHERE id = ?", [id]);
  res.json({ message: "Item deleted" });
};