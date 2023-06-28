import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import { KeyValuePair } from 'tailwindcss/types/config';

interface UserData {
    bio: string,
    avatar_url: string,
    is_current_user: boolean
}

async function handleDataRetrieval(userName: string, jwtToken: string): Promise<UserData> {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userName}`, { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data
    } catch(error : any) {
        throw new Error(`User data retrieval failed: ${error.response.data.error}`);
    }
}

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
    try {
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;
        const userData = await handleDataRetrieval(params.username, jwtToken.value);
        return new NextResponse(JSON.stringify({ userData}));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}