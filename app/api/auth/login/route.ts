import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface LoginForm {
    email: string,
    password: string
}

interface JwtToken {
    jwt: {
        token: string,
        expiry: number
    },
    username: string,
    todays_word: string
}

// https://codevoweb.com/jwt-authentication-in-nextjs-13-api-route-handlers/?utm_content=cmp-true
async function getJwtToken(email: string, password: string): Promise<JwtToken>{
    const response = await axios.post("http://localhost:3000/auth/login", { 
            email: email,
            password: password
        },
        { withCredentials: true }
    );
    return response.data;
}

function getMidnight(): Date {
    const midnight = new Date();
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0,0,0,0);
    return midnight;
}

export async function POST(req: NextRequest) {
    console.log('in api')
    try {
        const { email, password }: LoginForm = await req.json();
        
        if(! email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            return new NextResponse(JSON.stringify({ error: 'Please enter a valid email address.' }), { status: 400 });
        }

        const response: JwtToken = await getJwtToken(email, password);

        const cookieOptions = {
            name: "jwtToken",
            value: response.jwt.token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: response.jwt.expiry
        };

        const nxtResponse = new NextResponse(JSON.stringify({ message: 'User Logged In Successfully'}), { status: 200});
        await Promise.all([
            nxtResponse.cookies.set(cookieOptions),
            nxtResponse.cookies.set({
                name: "userName",
                value: response.username,
                maxAge: response.jwt.expiry
            }),
            nxtResponse.cookies.set({
                name: "dailyWord",
                value: response.todays_word,
                expires: getMidnight()
            })
        ])
        return nxtResponse;
    } catch (error: any) {
        const errorMsg = error.response?.status === 401
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}