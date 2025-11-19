import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import db, { testConnection } from './db.js'; // Import the test function

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Giraffe Café API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Start server only after testing database connection
async function startServer() {
  // Test database connection first
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.log('❌ Cannot start server without database connection');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🦒 Giraffe Café API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 Public API: http://localhost:${PORT}/categories`);
    console.log(`📍 Admin API: http://localhost:${PORT}/admin/categories`);
  });
}

startServer();