import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { UserBalance, Platform } from '@/models';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('apiKey');
        const { userId } = await params;

        if (!key) {
            return NextResponse.json({ error: 'API key required' }, { status: 401 });
        }

        const platform = await Platform.findOne({ $or: [{ apiKey: key }, { publicKey: key }] });
        if (!platform) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        const balanceDoc = await UserBalance.findOne({ platformId: platform._id, userId });
        return NextResponse.json({ balance: balanceDoc ? balanceDoc.balance : 0 }, {
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
