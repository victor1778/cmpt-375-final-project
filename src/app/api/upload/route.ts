import { NextRequest, NextResponse } from "next/server";
export const POST = async (request: NextRequest) => {
    try {
        const data: FormData = await request.formData();
        const file = data.get('filepond');
        const urlToPost = data.get('url');
        const fields = JSON.parse(data.get('fields') as string);

        if (!file) {
            return NextResponse.error();
        }

        if ((file as File).type !== "image/jpeg") {
            return NextResponse.error();
        }

        const fileEntry = file as File;

        const formData = new FormData();

        formData.append("key", fields['key']);

        Object.entries(fields).forEach(([key, value]) => {
            if (key !== "key") {
                formData.append(key, value as string);
            }
        });

        formData.append("file", fileEntry, fileEntry.name);

        const res = await fetch(urlToPost as string, {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.log(res);
            return NextResponse.error();
        }


        return NextResponse.json({
            message: true,
            url: `${process.env?.CLOUDFRONT_URL}/${fields.key}`
        });


    } catch (error) {
        return NextResponse.error();
    }
};