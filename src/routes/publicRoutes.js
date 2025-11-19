import express from "express";
import {
  getCategories,
  getCategoryById
} from "../controllers/categoriesController.js";

import {
  getItemsByCategory
} from "../controllers/itemsController.js";

const router = express.Router();

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.get("/../items/:id", getItemsByCategory);

export default router;