import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface ResetPasswordForm {
    password: string,
    confirmPassword: string,
    resetToken: string
}

async function resetPassword(password: string, confirmPassword: string, resetToken: string): Promise<void> {
    const response = await axios.post("http://localhost:3000/auth/reset_password", { 
            password: password,
            password_confirmation: confirmPassword,
            password_reset_token: resetToken
        },
        { withCredentials: true }
    );
    console.log(response.data)
    return response.data;
}


export async function POST(req: NextRequest) {
    try {
        const { password, confirmPassword, resetToken }: ResetPasswordForm = await req.json();
        console.log(password, confirmPassword, resetToken)
        await resetPassword(password, confirmPassword, resetToken);
        return new NextResponse(JSON.stringify({ message: 'Your Password has been reset'}), { status: 200});
    } catch (error: any) {
        const errorMsg = error.response?.data?.error
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}