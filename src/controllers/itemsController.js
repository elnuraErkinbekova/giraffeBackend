import db from "../db.js";

import db from "../db.js";
import translationService from "../services/translationService.js";

export const getItemsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || "en";

    const [rows] = await db.query(
      "SELECT * FROM items WHERE category_id = ?",
      [id]
    );

    // If English, return raw items (fast and no translation needed)
    if (lang === "en") {
      return res.json(rows);
    }

    const translatedItems = [];

    for (const item of rows) {
      const newItem = { ...item };

      // Only translate description + ingredients
      newItem.description = await translationService.translateText(
        item.description,
        lang,
        "en"
      );

      newItem.ingredients = await translationService.translateText(
        item.ingredients,
        lang,
        "en"
      );

      translatedItems.push(newItem);
    }

    res.json(translatedItems);

  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Failed to load translated items" });
  }
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