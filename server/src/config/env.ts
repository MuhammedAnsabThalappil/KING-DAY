import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/kingday?schema=public'),
  JWT_SECRET: z.string().default('king-day-super-secret-jwt-key-2026'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_stub_key_id'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_test_stub_key_secret'),
  CLIENT_URL: z.string().default('https://king-day.shop'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
