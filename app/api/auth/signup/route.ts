import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface SignUpForm {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}


// https://codevoweb.com/jwt-authentication-in-nextjs-13-api-route-handlers/?utm_content=cmp-true
async function createAccount(name: string, email: string, password: string): Promise<void> {
    const response = await axios.post("http://localhost:3000/users", { 
            email: email,
            password: password,
            user_name: name
        },
        { withCredentials: true }
    );
    return response.data;
}


export async function POST(req: NextRequest) {
    try {
        const { name, email, password, confirmPassword }: SignUpForm = await req.json();
        
        if(! email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            return new NextResponse(JSON.stringify({ error: 'Please enter a valid email address.' }), { status: 400 });
        }
        else if(password != confirmPassword) {
            return new NextResponse(JSON.stringify({ error: 'Passwords do not match.' }), { status: 400 });
        }
        else if(password.length < 6) {
            return new NextResponse(JSON.stringify({ error: 'Password must be at least 6 characters long.' }), { status: 400 });
        }
        
        await createAccount(name, email, password);

        return new NextResponse(JSON.stringify({ message: 'User Created Successfully'}), { status: 200});
    } catch (error: any) {
        const errorMsg = error.response?.status === 401
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}