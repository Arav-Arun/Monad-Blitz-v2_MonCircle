import mongoose from 'mongoose';

// --- Platform Schema ---
const PlatformSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    category: String,
    apiKey: { type: String, unique: true },
    publicKey: { type: String, unique: true },
    monPool: { type: Number, default: 0 },
    monIssued: { type: Number, default: 0 },
    walletAddress: String,
    registrationTxHash: String,
    rewardConfig: {
        baseRate: { type: Number, default: 10 },
        repeatMultiplier: { type: Number, default: 2 },
        minWithdrawal: { type: Number, default: 500 },
        monthlyCap: { type: Number, default: 10000 },
    },
    createdAt: { type: Date, default: Date.now },
});

export const Platform = mongoose.models.Platform || mongoose.model('Platform', PlatformSchema);

// --- UserBalance Schema ---
const UserBalanceSchema = new mongoose.Schema({
    platformId: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform' },
    userId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
});
UserBalanceSchema.index({ platformId: 1, userId: 1 }, { unique: true });

export const UserBalance = mongoose.models.UserBalance || mongoose.model('UserBalance', UserBalanceSchema);

// --- Order Schema ---
const OrderSchema = new mongoose.Schema({
    platformId: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform' },
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    monAwarded: { type: Number, required: true },
    status: { type: String, default: 'COMPLETED' },
    createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
