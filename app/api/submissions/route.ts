import { NextRequest, NextResponse} from 'next/server';
import axios from "axios";
import {S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { KeyValuePair } from 'tailwindcss/types/config';

interface FormData {
    fileContent: string;
    note: string | null;
}

async function handleS3Upload(s3Key: string, fileContent: string, fileType: string): Promise<any> {
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
    }
    catch (error) {
        throw new Error(`S3 Upload failed: ${error}`);
    }
}

async function handleSubmissionSave(userName: string, s3Key: string, note: string | null, jwtToken: string): Promise<any> {
    try {
        const response = await axios.post(`http://localhost:3000/users/${userName}/submissions`, {
            submission: {
                image_url: s3Key,
                note: note,
            }
        },  { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    } catch(error : any) {
        throw new Error(`Submission Save failed: ${error.response.data.error}`);
    }
}
  
export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const formData: FormData = {
            fileContent: data.get('fileContent') as string,
            note: data.get('note') as string | null
        }
        const userName: KeyValuePair = request.cookies.get("userName") as KeyValuePair;
        const s3Key = `submissions/${userName.value}-${Date.now()}.jpeg`;
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;

        await handleS3Upload(s3Key, formData.fileContent, 'image/jpeg');
        await handleSubmissionSave(userName.value, s3Key, formData.note, jwtToken.value);
        return new NextResponse(JSON.stringify({ message: 'Submission Saved Successfully' }));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}

interface Submission {
    image_url: string;
    note: string | null;
    date: Date;
    word: string;
}

async function handleSubmissionRetrieval(userName: string, jwtToken: string, page:string, perPage:string): Promise<Submission[]> {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userName}/submissions?page=${page}&per_page=${perPage}`, { 
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data
    } catch(error : any) {
        throw new Error(`Submission Retrieval failed: ${error.response.data.error}`);
    }
}

export async function GET(request: NextRequest) {
    try {
        const page: string = request.nextUrl.searchParams.get('page') as string;
        const perPage: string = request.nextUrl.searchParams.get('per_page') as string;
        const userName: KeyValuePair = request.cookies.get("userName") as KeyValuePair;
        const jwtToken: KeyValuePair = request.cookies.get("jwtToken") as KeyValuePair;
        const submissions = await handleSubmissionRetrieval(userName.value, jwtToken.value, page, perPage);
        return new NextResponse(JSON.stringify({ submissions: submissions }));
    } catch(error) {
        return new NextResponse(JSON.stringify({ error: 'An Error occured' }), { status: 500 });
    }
}