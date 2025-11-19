import express from "express";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("src/uploads"));

app.use("/categories", publicRoutes);
app.use("/items", publicRoutes);

app.use("/admin", adminRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port 3000")
);