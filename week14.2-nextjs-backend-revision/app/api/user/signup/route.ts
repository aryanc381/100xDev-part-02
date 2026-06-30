import { signup } from "@/app/src/services/signup";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

const userSchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    password: zod.string()
});

export async function GET() {
    return NextResponse.json({
        status: 200,
        msg: "endpoint is healthy."
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = userSchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({ status: 403, msg: "invalid signup body" });
        }

        const { name, email, password } = parsed.data;
        console.log(`${name}, ${email}, ${password} have safely reached the backend.`);

        const response = await signup(name, email, password);

        return NextResponse.json({
            status: response.status,
            user: response.user
        });
    } catch(err) {
        return NextResponse.json({
            status: 500,
            msg: 'Internal Server Error.'
        });
    }
}