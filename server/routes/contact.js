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
 * POST /api/contact
 * Body: { name, email, message }
 * Saves the contact message to db.json.
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        await db.read();
        db.data = db.data || defaultData;

        const contactEntry = {
            id: uuidv4(),
            name,
            email,
            message,
            createdAt: new Date().toISOString()
        };

        db.data.contacts.push(contactEntry);
        await db.write();

        res.status(201).json({ success: true, contact: contactEntry });
    } catch (err) {
        console.error('Contact error:', err);
        res.status(500).json({ error: 'Failed to save message.' });
    }
});

export default router;
