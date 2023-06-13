import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface SignUpForm {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}


// https://codevoweb.com/jwt-authentication-in-nextjs-13-api-route-handlers/?utm_content=cmp-true
async function createAccount(name: string, email: string, password: string, confirmPassword: string): Promise<void> {
    const response = await axios.post("http://localhost:3000/users", { 
            email: email,
            password: password,
            user_name: name,
            password_confirmation: confirmPassword
        },
        { withCredentials: true }
    );
    return response.data;
}


export async function POST(req: NextRequest) {
    try {
        const { name, email, password, confirmPassword }: SignUpForm = await req.json();
        await createAccount(name, email, password, confirmPassword);
        return new NextResponse(JSON.stringify({ message: 'Account created! Please check your emails for a verification link'}), { status: 200});
    } catch (error: any) {
        const errorMsg = error.response?.data?.error
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}