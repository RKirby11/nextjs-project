import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface ResetPasswordRequest {
    email: string,
}

// https://codevoweb.com/jwt-authentication-in-nextjs-13-api-route-handlers/?utm_content=cmp-true
async function requestPasswordReset(email: string): Promise<void> {
    const response = await axios.post("http://localhost:3000/auth/request_password_reset", { 
            email: email,
        },
        { withCredentials: true }
    );
    return response.data;
}


export async function POST(req: NextRequest) {
    try {
        const { email }: ResetPasswordRequest = await req.json();
        await requestPasswordReset(email);
        return new NextResponse(JSON.stringify({ message: 'A new password reset link has been sent to your email.'}), { status: 200});
    } catch (error: any) {
        const errorMsg = error.response?.data?.error
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}