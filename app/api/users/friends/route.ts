import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import { KeyValuePair } from 'tailwindcss/types/config';

interface Friend {
    username: string,
    avatar: string | null
}

async function handleFriendsRetrieval(jwtToken: string): Promise<Friend[]> {
    try {
        const response = await axios.get(`http://localhost:3000/friendships`, { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data
    } catch(error : any) {
        throw new Error(`Friends Retrieval failed: ${error.response.data.error}`);
    }
}

export async function GET(request: NextRequest) {
    try {
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;
        const friends = await handleFriendsRetrieval(jwtToken.value);
        console.log(friends)
        return new NextResponse(JSON.stringify({ friends: friends }), { status: 200 });
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}