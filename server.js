import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();
const app = express();

// Allowed origins: add localhost variants + deployed frontend URL
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:4173',
      'http://127.0.0.1:4173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'https://your-frontend-render-url.onrender.com' // <--- add your deployed frontend URL
    ];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// --- Error Handling Middleware ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
