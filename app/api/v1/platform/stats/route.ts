import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Platform, Order, UserBalance } from '@/models';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('apiKey');

        if (!key) {
            return NextResponse.json({ error: 'API key required' }, { status: 401 });
        }

        const platform = await Platform.findOne({ $or: [{ apiKey: key }, { publicKey: key }] });
        if (!platform) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        const recentOrders = await Order.find({ platformId: platform._id }).sort({ createdAt: -1 }).limit(10);
        const topUsers = await UserBalance.find({ platformId: platform._id }).sort({ balance: -1 }).limit(10);

        return NextResponse.json({
            platform: {
                name: platform.name,
                monPool: platform.monPool,
                monIssued: platform.monIssued,
                apiKey: platform.apiKey,
                publicKey: platform.publicKey,
                rewardRate: platform.rewardConfig.baseRate
            },
            recentOrders,
            topUsers
        }, {
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
