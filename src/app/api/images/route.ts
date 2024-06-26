import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {

    // Get the image url from the query string url
    const image = request.nextUrl.searchParams.get('url');

    try {

        const imageUrl = image as string;

        const res = await fetch(imageUrl, {
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
        return res;

    } catch (error) {
        return NextResponse.error();
    }
}