import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import { KeyValuePair } from 'tailwindcss/types/config';


async function sendFriendRequest(userName: string, responderName: string, jwtToken: string): Promise<void> {
    try {
        await axios.patch(`http://localhost:3000/friendship/create`, {
            responder_name: responderName,
        }
        ,  { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return;
    } catch(error : any) {
        throw new Error(`Friend Request failed: ${error.response.data.error}`);
    }
}
  
export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
    try {
        const userName: KeyValuePair = req.cookies.get("userName") as KeyValuePair;
        if (userName.value !== params.username) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const responderName = params.username;
        const jwtToken: KeyValuePair = req.cookies.get("jwtToken") as KeyValuePair;
        await sendFriendRequest(userName.value, responderName, jwtToken.value);
        return new NextResponse(JSON.stringify({ message: 'Friendship Request Sent'}));
    
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}