import { Router } from 'express';
import { Low, JSONFile } from 'lowdb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../data/db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

const router = Router();

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        await db.read();
        db.data = db.data || { users: [], orders: [], contacts: [], products: [] };

        // Check if user already exists
        const existingUser = db.data.users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existingUser) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            id: uuidv4(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        db.data.users.push(newUser);
        await db.write();

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        await db.read();
        db.data = db.data || { users: [], orders: [], contacts: [], products: [] };

        // Find user by email
        const user = db.data.users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Compare password hashes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

export default router;
