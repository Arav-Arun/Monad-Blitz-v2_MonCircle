import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Platform, Order, UserBalance } from '@/models';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Auth via header
        const key = req.headers.get('x-api-key');
        if (!key) return NextResponse.json({ error: 'API key required' }, { status: 401 });

        const platform = await Platform.findOne({ apiKey: key });
        if (!platform) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

        const body = await req.json();
        const { orderId, userId, amount, monAmount } = body;

        // Use direct monAmount if provided, otherwise fallback to rate (restricted to MON terms)
        const reward = monAmount !== undefined ? Number(monAmount) : (amount / 100) * platform.rewardConfig.baseRate;

        // Create order
        const order = await Order.create({
            platformId: platform._id,
            orderId,
            userId,
            amount: amount || 0,
            monAwarded: reward
        });

        // Update user balance
        await UserBalance.findOneAndUpdate(
            { platformId: platform._id, userId },
            { $inc: { balance: reward }, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        // Update platform pool
        platform.monIssued += reward;
        platform.monPool -= reward;
        await platform.save();

        return NextResponse.json({ order, reward, newPool: platform.monPool }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, {
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
        }
    });
}
