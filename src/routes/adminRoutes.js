import express from "express";
import upload from "../middleware/upload.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  addCategory,
  deleteCategory
} from "../controllers/categoriesController.js";

import {
  addItem,
  deleteItem
} from "../controllers/itemsController.js";

const router = express.Router();

router.post("/category", adminAuth, upload.single("img"), addCategory);
router.delete("/category/:id", adminAuth, deleteCategory);

router.post("/item", adminAuth, upload.single("img"), addItem);
router.delete("/item/:id", adminAuth, deleteItem);

export default router;