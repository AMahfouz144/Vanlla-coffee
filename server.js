import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes (registered BEFORE static files) ──────────────
import productsRouter from './server/routes/products.js';
app.use('/api/products', productsRouter);
import authRouter from './server/routes/auth.js';
app.use('/api/auth', authRouter);
import ordersRouter from './server/routes/orders.js';
app.use('/api/orders', ordersRouter);
import contactRouter from './server/routes/contact.js';
app.use('/api/contact', contactRouter);

// ── Serve the project root as static files ───────────────────
// index.html, js/, css/, views/, components/, data/ all live in root
app.use(express.static(__dirname));

// Catch-all: serve index.html for SPA-style routing
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅  Server running at http://localhost:${PORT}`);
});
