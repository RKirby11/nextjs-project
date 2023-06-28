import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

interface LoginForm {
    email: string,
    password: string,
    verificationCode: string | null
}

interface JwtToken {
    jwt: {
        token: string,
        expiry: number
    },
    username: string,
    todays_word: string,
    avatar_url: string | null
}

// https://codevoweb.com/jwt-authentication-in-nextjs-13-api-route-handlers/?utm_content=cmp-true
async function getJwtToken(email: string, password: string, verificationCode: string | null ): Promise<JwtToken>{
    const response = await axios.post("http://localhost:3000/auth/login", { 
            email: email,
            password: password,
            email_verification_code: verificationCode
        },
        { withCredentials: true }
    );
    return response.data;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password, verificationCode }: LoginForm = await req.json();
        
        if(! email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            return new NextResponse(JSON.stringify({ error: 'Please enter a valid email address.' }), { status: 400 });
        }

        const response: JwtToken = await getJwtToken(email, password, verificationCode);
        const cookieExpiry = new Date(response.jwt.expiry);

        const cookieOptions = {
            name: "jwtToken",
            value: response.jwt.token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            expires: cookieExpiry
        };

        const nxtResponse = new NextResponse(JSON.stringify({ message: 'User Logged In Successfully'}), { status: 200});
        await Promise.all([
            nxtResponse.cookies.set(cookieOptions),
            nxtResponse.cookies.set({
                name: "userName",
                value: response.username,
                expires: cookieExpiry
            }),
            nxtResponse.cookies.set({
                name: "dailyWord",
                value: response.todays_word,
                expires: cookieExpiry
            }),
        ])
        if(response.avatar_url !== null) {
            await nxtResponse.cookies.set({
                name: "avatarURL",
                value: response.avatar_url,
                expires: cookieExpiry
            });
        }
        return nxtResponse;
    } catch (error: any) {
        console.log(error)
        const errorMsg = error.response?.status === 401
        ? (error.response.data as { error: string }).error
        : 'Sorry, something went wrong. Please try again later.';
        return new NextResponse(JSON.stringify({ error: errorMsg }), { status: error.response?.status || 500 });
    }
}