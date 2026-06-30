import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
    const { nextauth } = await params;
    console.log(nextauth)
    return NextResponse.json({
        msg: "Handler he re baba"
    });
}