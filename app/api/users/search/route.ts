import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import { KeyValuePair } from 'tailwindcss/types/config';

interface User {
    id: number;
    user_name: string;
    friend_status: "friends" | "pending" | "recieved" | "none"
}

async function handleUsersRetrieval(userName: string, jwtToken: string, query:string): Promise<User[]> {
    try {
        const response = await axios.get(`http://localhost:3000/users?query=${query}`, { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data.users
    } catch(error : any) {
        throw new Error(`Users Retrieval failed: ${error.response.data.error}`);
    }
}

export async function GET(request: NextRequest) {
    try {
        const query: string = request.nextUrl.searchParams.get('query') as string;
        const userName: KeyValuePair = request.cookies.get("userName") as KeyValuePair;
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;
        const users = await handleUsersRetrieval(userName.value, jwtToken.value, query);
        return new NextResponse(JSON.stringify({ users: users }), { status: 200 });
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}