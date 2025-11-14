import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

app.get("/categories", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories");
  res.json(rows);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
