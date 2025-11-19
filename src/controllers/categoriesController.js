import db from "../db.js";

export const getCategories = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories");
  res.json(rows);
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);

  if (rows.length === 0) return res.status(404).json({ message: "Not found" });

  res.json(rows[0]);
};

export const addCategory = async (req, res) => {
  const { name_en, name_ru, name_kg} = req.body;
  const img = req.file ? req.file.path : null;

  const [result] = await db.query(
    "INSERT INTO categories (name_en, name_ru, name_kg, img) VALUES (?, ?, ?, ?)",
    [name_en, name_ru, name_kg, img]
  );

  res.json({ id: result.insertId, message: "Category added" });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
  res.json({ message: "Category deleted" });
};