import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
// import { signupValidation } from "@/src/lib/validation/user.schema";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // const validation = signupValidation(body)

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

        const { name, email, password, role, image, status,phone } = body
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: "User Is Already Present", success: false }, { status: 200 });
        }

        const hashedPassword = await hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                status,
                image,
                phone
            }
        })

        const { password: _, ...safeUser } = newUser

        return NextResponse.json({ message: "User Created Successfully", success: true, user: safeUser }, { status: 200 });

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"
        return NextResponse.json({ message: "Failed To Create USer", success: false, error: err }, { status: 500 });
    }

}
