import prisma from "@/src/lib/prisma";
// import { taskValidation } from "@/src/lib/validation/task.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // const validation = taskValidation(body)

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

        const { task, description, priority, status, dueDate, projectId, memberId } = body;

        const newTask = await prisma.task.create({
            data: {
                task,
                description,
                priority,
                status,
                dueDate,
                projectId,
                memberId

            },
            include: {
                member: {
                    select: {
                        name: true,
                        id: true,
                        role: true,
                        // image:true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })
        return NextResponse.json({ message: "Tasks Created Successfully", success: true, task: newTask })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Create Task", success: false, error: err }, { status: 500 })
    }
}