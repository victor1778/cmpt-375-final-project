import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const res = await fetch(`${process.env?.SIGNED_URL}`, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json',
                'accept': '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'connection': 'keep-alive',
            }
        });

        if (!res.ok) {
            return NextResponse.error();
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.error();
    }
}