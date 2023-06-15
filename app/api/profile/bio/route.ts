import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import { KeyValuePair } from 'tailwindcss/types/config';

interface NewBio {
    bio: string
}

async function handleBioSave(userName: string, bio: string, jwtToken: string): Promise<string> {
    try {
        const response = await axios.patch(`http://localhost:3000/users/${userName}/update_bio`, {
            bio: bio,
        },  { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data.bio;
    } catch(error : any) {
        throw new Error(`Bio Upload failed: ${error.response.data.error}`);
    }
}
  
export async function POST(req: NextRequest) {
    try {
        const { bio }: NewBio = await req.json();
        const userName: KeyValuePair = req.cookies.get("userName") as KeyValuePair;
        const jwtToken: KeyValuePair = req.cookies.get("jwtToken") as KeyValuePair;
        const updatedBio = await handleBioSave(userName.value, bio, jwtToken.value);
        console.log('updatedBio: ', updatedBio)
        return new NextResponse(JSON.stringify({ message: 'Bio Updated Successfully', bio: updatedBio }));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}

async function handleBioRetrieval(userName: string, jwtToken: string): Promise<string> {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userName}/show_bio`, { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data.bio
    } catch(error : any) {
        throw new Error(`Bio retrieval failed: ${error.response.data.error}`);
    }
}

export async function GET(request: NextRequest) {
    try {
        const userName: KeyValuePair = request.cookies.get("userName") as KeyValuePair;
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;
        const bio = await handleBioRetrieval(userName.value, jwtToken.value);
        return new NextResponse(JSON.stringify({bio: bio }));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}