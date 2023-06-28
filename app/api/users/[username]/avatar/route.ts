import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import {S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { KeyValuePair } from 'tailwindcss/types/config';

interface AvatarImage {
    file: string;
}

async function handleS3Upload(s3Key: string, fileContent: string, fileType: string): Promise<void> {
    const s3Client = new S3Client({
        'region': "eu-west-2",
        'credentials': {
            'accessKeyId': process.env.S3_ACCESS_KEY_ID as string,
            'secretAccessKey': process.env.S3_SECRET_ACCESS_KEY as string
        }
    });
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        ContentType: fileType,
        Body: Buffer.from(fileContent.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    });
    try {
        const response = await s3Client.send(command);
        console.log('response: ', response);
    }
    catch (error) {
        throw new Error(`S3 Upload failed: ${error}`);
    }
}

async function handleAvatarSave(userName: string, s3Key: string, jwtToken: string): Promise<string> {
    try {
        const response = await axios.patch(`http://localhost:3000/users/${userName}/update_avatar`, {
            avatar_url: s3Key,
        },  { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data.avatar_url;
    } catch(error : any) {
        throw new Error(`Avatar Save failed: ${error.response.data.error}`);
    }
}
  
export async function POST(req: NextRequest, { params }: { params: { username: string }}) {
    try {
        const userName: KeyValuePair = req.cookies.get("userName") as KeyValuePair;
        if(userName.value !== params.username) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const data = await req.formData();
        const avatarImage: AvatarImage = {
            file: data.get('file') as string,
        }
        const s3Key = `avatars/${userName.value}-${Date.now()}.jpeg`;
        const jwtToken: KeyValuePair = req.cookies.get("jwtToken") as KeyValuePair;
        
        await handleS3Upload(s3Key, avatarImage.file, "image/jpeg");
        const presignedImageURL = await handleAvatarSave(userName.value, s3Key, jwtToken.value);
        
        const nxtResponse = new NextResponse(JSON.stringify({ avatarUrl: presignedImageURL }));
        await Promise.all([
            nxtResponse.cookies.set({
                name: "avatarURL",
                value: presignedImageURL,
                maxAge: 60 * 60 * 24,
            }),
        ])
        return nxtResponse;

    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}


async function handleAvatarRetrieval(userName: string, jwtToken: string): Promise<string> {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userName}/show_avatar`, { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data.avatar_url;
    } catch(error : any) {
        throw new Error(`Avatar retrieval failed: ${error.response.data.error}`);
    }
}

export async function GET(request: NextRequest, { params }: { params: { username: string }}) {
    try {
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;
        const presignedImageURL = await handleAvatarRetrieval(params.username, jwtToken.value);
        return new NextResponse(JSON.stringify({ avatarUrl: presignedImageURL }));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}