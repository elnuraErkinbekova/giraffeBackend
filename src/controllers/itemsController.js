import db from "../db.js";

export const addItem = async (req, res) => {
  const { 
    category_id, 
    title_en, title_ru, title_ky, 
    description_en, description_ru, description_ky,
    ingredients_en, ingredients_ru, ingredients_ky,
    price_en, price_ru, price_ky 
  } = req.body;
  
  const img = req.file ? req.file.path : null;

  const [result] = await db.query(
    `INSERT INTO items
     (category_id, title_en, title_ru, title_ky, 
      description_en, description_ru, description_ky,
      ingredients_en, ingredients_ru, ingredients_ky,
      price_en, price_ru, price_ky, img)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id, 
      title_en, title_ru, title_ky,
      description_en, description_ru, description_ky,
      ingredients_en, ingredients_ru, ingredients_ky,
      price_en, price_ru, price_ky,
      img
    ]
  );

  res.json({ id: result.insertId, message: "Item added" });
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM items WHERE id = ?", [id]);
  res.json({ message: "Item deleted" });
};