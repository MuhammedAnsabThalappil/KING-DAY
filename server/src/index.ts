import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import apiRoutes from './routes/api';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration (Trusting king-day.shop and local development)
const allowedOrigins = [
  'https://king-day.shop',
  'https://www.king-day.shop',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy rejection: Origin not allowed.'));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for API protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', limiter);

// Mount API routes
app.use('/api', apiRoutes);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'OK', brand: 'KING DAY Kozhikode', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`🚀 KING DAY Server running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  });
}

export default app;
