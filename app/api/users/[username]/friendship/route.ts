import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import { KeyValuePair } from 'tailwindcss/types/config';

interface AxiosHeader {
    headers: {
        Authorization: string,
        Accept: string,
        "Content-Type": string
    },
    withCredentials: boolean
}

async function sendFriendRequest(friendName: string, headers: AxiosHeader): Promise<Relationship> {
    try {
        const response = await axios.post(`http://localhost:3000/friendships`, {
            friend_name: friendName
        }, headers );
        return response.data.relationship;
    } catch(error : any) {
        throw new Error(`Friend Request failed: ${error.response.data.error}`);
    }
}

async function updateFriendship(headers: AxiosHeader, action: string, id: number): Promise<Relationship> {
    try {
        const response = await axios.patch(`http://localhost:3000/friendships/${id}`, {
            update_type: action,
        }, headers );
        return response.data.relationship;
    } catch(error : any) {
        throw new Error(`Update failed: ${error.response.data.error}`);
    }
}

async function deleteFriendship(headers: AxiosHeader, id: number): Promise<Relationship> {
    try {
        const response = await axios.delete(`http://localhost:3000/friendships/${id}`, headers );
        return response.data.relationship;
    } catch(error : any) {
        throw new Error(`Friend Request failed: ${error.response.data.error}`);
    }
}

interface Relationship {
    status: "not friends" | "friends" | "request sent" | "request received",
    id: number | null
}

interface InputData{
    action: "send request" | "accept request" | "reject request" | "cancel request" | "unfriend",
    relationship: Relationship
}

export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
    try {
        const userName: KeyValuePair = req.cookies.get("userName") as KeyValuePair;
        const friendName = params.username;
        if (userName.value === friendName) {
            //user can not update relationship with self
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const { action, relationship }: InputData = await req.json();    
        const { status, id } = relationship;   
        const jwtToken: KeyValuePair = req.cookies.get("jwtToken") as KeyValuePair;
        const headers: AxiosHeader = {
            headers: {
                "Authorization": `Bearer ${jwtToken.value}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        }

        let response = null;
        if (status === "not friends" && action === "send request") 
            response = await sendFriendRequest(friendName, headers);
        else if (status === "friends" && action === "unfriend" && id)
            response = await deleteFriendship(headers, id);
        else if (status === "request sent" && action === "cancel request" &&  id)
            response = await deleteFriendship(headers, id);
        else if (status === "request received" && (action === "accept request" || action === "reject request") && id)
            response = await updateFriendship(headers, action, id);
        else
            throw new Error("Invalid action");
        console.log(response)
        return new NextResponse(JSON.stringify({ updatedRelationship: response}));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}