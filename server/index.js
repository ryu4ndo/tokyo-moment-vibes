import './loadEnv.js';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/api.js';
import businessRouter from './routes/business.js';
import adminRouter from './routes/admin.js';
import billingRouter from './routes/billing.js';
import { initPlatformData } from './platform/dataAccess.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());

app.post(
  '/api/billing/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const { handleStripeWebhook } = await import('./routes/billing.js');
      const result = await handleStripeWebhook(req.body, req.headers['stripe-signature']);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

app.use(express.json({ limit: '1mb' }));

await initPlatformData();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'tokyo-vibes-api' });
});

app.use('/api', apiRouter);
app.use('/api/business', businessRouter);
app.use('/api/admin', adminRouter);
app.use('/api/billing', billingRouter);

if (isProduction) {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[server] API running at http://localhost:${PORT}`);
  if (isProduction) {
    console.log(`[server] Serving frontend from dist/`);
  } else {
    console.log(`[server] Development mode — Vite proxies /api to this server`);
  }
});
