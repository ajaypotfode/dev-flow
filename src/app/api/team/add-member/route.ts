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
            },
           include: {
                tasks: {
                    select: {
                        status: true,
                        id: true
                    }
                },
                
            }
        })

        // const updatedUser = users.map((user) => {
        const completedTasks = newUser.tasks.filter(task => task.status === 'completed').length;
        const activeTasks = newUser.tasks.filter(task => task.status === 'active').length;

        const { tasks,  ...restdetails } = newUser;

        const result = {
            ...restdetails,
            progress: {
                totalTasks: newUser.tasks.length,
                completedTasks,
                activeTasks,
                completionRate: newUser.tasks.length === 0 ? 0
                    : Math.round((completedTasks / newUser.tasks.length) * 100),
            },
        }


        return NextResponse.json({ message: "User Created Successfully", success: true, user: result }, { status: 200 });

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"
        return NextResponse.json({ message: "Failed To Create USer", success: false, error: err }, { status: 500 });
    }

}