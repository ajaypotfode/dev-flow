import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
// import { loginValidation, signupValidation } from "@/src/lib/validation/user.schema";
import { generateRefreshToken, generateToken } from "@/src/lib/jwtVerification";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // const validation = loginValidation(body)

        // // Validation failed
        // if (!validation.success) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: validation.message
        //         },
        //         { status: 400 }
        //     )
        // }

        const { email, password } = body
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            return NextResponse.json({ message: "Invalid Email", success: false }, { status: 404 });
        }

        const isValidPass = await compare(password, existingUser.password);

        if (!isValidPass) {
            return NextResponse.json({ message: "Invalid Password", success: false }, { status: 404 });
        }

        const token = generateToken({ id: existingUser.id, role: existingUser.role });
        const refreshToken = generateRefreshToken({ id: existingUser.id, role: existingUser.role })

        const { password: _, ...safeUser } = existingUser

        const response = NextResponse.json({ message: "User Created Successfully", success: true, user: { ...safeUser, token }, }, { status: 200 });
        // console.log("token in login :", token);

        response.cookies.set('devToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 15,
            path: '/'
        });

        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        })

        return response

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"
        return NextResponse.json({ message: "Failed To Create User", success: false, error: err }, { status: 500 });
    }

}