import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = new NextResponse(
        JSON.stringify({
            message: 'User Logged Out Successfully'
        }), 
        {
            status: 200,
            headers: {"Content-Type": "application/json"}
        }
    );
    response.cookies.delete("jwtToken");
    response.cookies.delete("userName");
    response.cookies.delete("avatarURL");
    return response;
}
