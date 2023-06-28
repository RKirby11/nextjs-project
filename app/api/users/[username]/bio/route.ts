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
  
export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
    try {
        const userName: KeyValuePair = req.cookies.get("userName") as KeyValuePair;
        if (userName.value !== params.username) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { bio }: NewBio = await req.json();
        const jwtToken: KeyValuePair = req.cookies.get("jwtToken") as KeyValuePair;
        const updatedBio = await handleBioSave(userName.value, bio, jwtToken.value);
        return new NextResponse(JSON.stringify({ message: 'Bio Updated Successfully', bio: updatedBio }));
    
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}
