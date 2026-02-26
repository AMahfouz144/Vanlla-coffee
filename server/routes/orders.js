import { Router } from 'express';
import { Low, JSONFile } from 'lowdb';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../data/db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

const defaultData = { users: [], orders: [], contacts: [], products: [] };

const router = Router();

/**
 * POST /api/orders
 * Body: { items: [...], shipping: { name, address, city } }
 * Returns the saved order with a unique orderId and timestamp.
 */
router.post('/', async (req, res) => {
    try {
        const { items, shipping } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'Order must contain at least one item.' });
        }
        if (!shipping || !shipping.name || !shipping.address || !shipping.city) {
            return res.status(400).json({ error: 'Shipping name, address, and city are required.' });
        }

        await db.read();
        db.data = db.data || defaultData;

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = {
            orderId: uuidv4(),
            items,
            shipping,
            total: parseFloat(total.toFixed(2)),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        db.data.orders.push(order);
        await db.write();

        res.status(201).json({ order });
    } catch (err) {
        console.error('Order error:', err);
        res.status(500).json({ error: 'Failed to place order.' });
    }
});

export default router;
