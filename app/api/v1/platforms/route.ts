import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Platform } from '@/models';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        await dbConnect();
        const platforms = await Platform.find({}, {
            name: 1,
            username: 1,
            category: 1,
            website: 1,
            monPool: 1,
            monIssued: 1,
            createdAt: 1
        }).sort({ createdAt: -1 });

        return NextResponse.json(platforms, {
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

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, username, email, website, category, monPool, walletAddress, registrationTxHash, rewardConfig } = body;

        const apiKey = `mc_live_${uuidv4().replace(/-/g, '')}`;
        const publicKey = `pk_live_${uuidv4().replace(/-/g, '')}`;

        const platform = await Platform.create({
            name,
            username,
            email,
            website,
            category,
            monPool: monPool || 500000,
            walletAddress,
            registrationTxHash,
            apiKey,
            publicKey,
            rewardConfig,
        });

        return NextResponse.json(platform, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
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
