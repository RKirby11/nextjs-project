import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface VerificationForm {
    email: string,
}

async function sendVerification(email: string): Promise<void> {
    const response = await axios.post("http://localhost:3000/auth/resend_verification", { 
            email: email,
        },
        { withCredentials: true }
    );
    return response.data;
}

export async function POST(req: NextRequest) {
    try {
        const { email }: VerificationForm = await req.json();
        await sendVerification(email);
        return new NextResponse(JSON.stringify({ message: 'A new verification link has been sent to your email.'}), { status: 200});
    } catch (error: any) {
        const errorMsg = error.response?.data?.error
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}