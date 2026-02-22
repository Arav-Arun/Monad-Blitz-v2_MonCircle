import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Platform } from '@/models';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const walletAddress = searchParams.get('walletAddress');

        if (!walletAddress) {
            return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
        }

        const platform = await Platform.findOne({ walletAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') } });

        if (!platform) {
            return NextResponse.json({ error: 'Platform not found for this wallet' }, { status: 404 });
        }

        return NextResponse.json({
            apiKey: platform.apiKey,
            publicKey: platform.publicKey,
            name: platform.name
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
