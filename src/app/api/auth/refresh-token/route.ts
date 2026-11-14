import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export const POST = async (req: NextRequest) => {
    try {
        // const refreshToken = req.cookies.get('refresh_token')?.value;
        const { refreshToken } = await req.json()
        
        // console.log("refresh Token Response :",refreshToken);
        
        if (!refreshToken) {
            return NextResponse.json({ message: "Unauthorized User", success: false }, { status: 401 });
        }

        const newToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRETE!) as { id: string, role: string };

        const accessToken = jwt.sign({
            id: newToken.id,
            role: newToken.role
        },
            process.env.JWT_SECRETE!,
            { expiresIn: '15m' }
        )

        const response = NextResponse.json({ token: accessToken, message: "token Generated", success: true })


        // response.cookies.set('devToken', accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 60 * 15,
        //     path: '/'
        // });

        return response

    } catch (error) {
        return NextResponse.json(
            { message: "Invalid Refresh Token" },
            { status: 401 }
        );
    }
}