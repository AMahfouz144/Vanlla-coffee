import { Router } from 'express';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve path to db.json relative to this file
const dbPath = join(__dirname, '../data/db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

const defaultData = { users: [], orders: [], contacts: [], products: [] };

const router = Router();

/**
 * GET /api/products
 * Optional query param: ?category=Coffee
 * Returns all products or those matching the given category.
 */
router.get('/', async (req, res) => {
    try {
        await db.read();
        db.data = db.data || defaultData;

        let products = db.data.products;

        const { category } = req.query;
        if (category && category !== 'All') {
            products = products.filter(
                (p) => p.category.toLowerCase() === category.toLowerCase()
            );
        }

        res.json(products);
    } catch (err) {
        console.error('Error reading products:', err);
        res.status(500).json({ error: 'Failed to load products.' });
    }
});

/**
 * GET /api/products/:id
 * Returns a single product by id.
 */
router.get('/:id', async (req, res) => {
    try {
        await db.read();
        db.data = db.data || defaultData;

        const product = db.data.products.find((p) => String(p.id) === req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json(product);
    } catch (err) {
        console.error('Error reading product:', err);
        res.status(500).json({ error: 'Failed to load product.' });
    }
});

export default router;
