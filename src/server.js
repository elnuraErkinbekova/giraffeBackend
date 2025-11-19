import express from "express";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", publicRoutes);

app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);