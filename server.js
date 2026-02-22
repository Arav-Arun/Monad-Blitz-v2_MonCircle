import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'viem';
import 'dotenv/config';
import { monadService } from './src/services/monadService.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'moncircle_secret_2026';

app.use(cors());
app.use(express.json());

// Initialize Monad Service
monadService.init();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moncircle')
    .then(() => console.log('✅ Loyalty DB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// Models
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletAddress: { type: String },
    // Balances stored as: { "Nike": 12.5, "Adidas": 4.2 }
    balances: { type: Map, of: Number, default: {} },
    createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total: { type: Number, required: true },
    customer: { walletAddress: String, email: String },
    monEarned: { type: Map, of: Number, default: {} },
    monRedeemed: { type: Map, of: Number, default: {} },
    status: { type: String, default: 'completed' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);

// Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet connection is compulsory for registration.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            walletAddress: walletAddress.toLowerCase()
        });
        await user.save();
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, name, email, walletAddress: user.walletAddress } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email,
                walletAddress: user.walletAddress,
                balances: user.balances
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/wallet-login', async (req, res) => {
    try {
        const { address, signature, message } = req.body;

        const isValid = await verifyMessage({
            address,
            message,
            signature,
        });

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const user = await User.findOne({ walletAddress: address.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Wallet not linked to any account. Please register with this wallet first.' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                walletAddress: user.walletAddress,
                balances: user.balances
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Order Routes
app.post('/api/checkout', async (req, res) => {
    try {
        const { orderId, total, customer, userId, monEarned, monRedeemed } = req.body;

        const newOrder = new Order({
            orderId,
            total,
            customer,
            userId,
            monEarned: monEarned || {},
            monRedeemed: monRedeemed || {}
        });
        await newOrder.save();

        // Update User Balances if authenticated
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                // Add earnings
                if (monEarned) {
                    for (const [brand, amount] of Object.entries(monEarned)) {
                        const current = user.balances.get(brand) || 0;
                        user.balances.set(brand, Number((current + amount).toFixed(2)));
                    }
                }
                // Subtract redemptions
                if (monRedeemed) {
                    for (const [brand, amount] of Object.entries(monRedeemed)) {
                        const current = user.balances.get(brand) || 0;
                        user.balances.set(brand, Number((current - amount).toFixed(2)));
                    }
                }
                await user.save();
            }
        }

        console.log(`[Loyalty] Order ${orderId} processed. Rewards updated.`);
        res.json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Withdrawal Route
app.post('/api/withdraw', authenticate, async (req, res) => {
    try {
        const { brand, amount } = req.body;
        const user = await User.findById(req.userId);

        if (!user.walletAddress) {
            return res.status(400).json({ error: 'No wallet address linked to this account.' });
        }

        const currentBalance = user.balances.get(brand) || 0;

        if (currentBalance < 100) {
            return res.status(400).json({ error: `Minimum 100 MON required to withdraw from ${brand}` });
        }

        if (amount > currentBalance) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Logic for blockchain withdrawal
        let settlement = { txHash: 'simulated_tx_hash', simulated: true };

        if (monadService.enabled) {
            try {
                settlement = await monadService.settle(user.walletAddress, amount, user._id.toString());
            } catch (err) {
                return res.status(500).json({ error: `Blockchain settlement failed: ${err.message}` });
            }
        } else {
            console.warn('[Withdraw] Monad Service not enabled. Simulating withdrawal.');
        }

        // Deduct the balance locally
        user.balances.set(brand, Number((currentBalance - amount).toFixed(2)));
        await user.save();

        res.json({
            success: true,
            message: `Successfully withdrawn ${amount} MON from ${brand}`,
            txHash: settlement.txHash,
            simulated: settlement.simulated,
            newBalances: user.balances
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Loyalty Backend running on http://localhost:${PORT}`));
