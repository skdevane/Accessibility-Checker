import express from 'express';
import cors from 'cors';
import scanRouter from './routes/scan';

process.env.PLAYWRIGHT_BROWSERS_PATH = '0';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/api/scan', scanRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Accessibility Checker API running on http://localhost:${PORT}`);
});

export default app;
