import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
// import { loginValidation, signupValidation } from "@/src/lib/validation/user.schema";
import { generateToken } from "@/src/lib/jwtVerification";

export const POST = async (req: NextRequest) => {
    try {
        const response = NextResponse.json({ message: "User Logout Successfully", success: true }, { status: 200 });
        // response.cookies.set("devToken", "", {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     expires: new Date(0),
        //     path: "/",
        // });

        response.cookies.delete('devToken');
        response.cookies.delete('refresh_token')

        return response

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"
        return NextResponse.json({ message: "Failed To Create User", success: false, error: err }, { status: 500 });
    }

}