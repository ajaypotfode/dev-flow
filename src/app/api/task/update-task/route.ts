import { taskValidation } from "@/src/features/tasks/task.schema";
import prisma from "@/src/lib/prisma";
// import { taskValidation } from "@/src/lib/validation/task.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const body = await req.json();
        const validation = taskValidation(body)

        // Validation failed

        if (!body.id) {
            return NextResponse.json({ message: "Id is required", success: false }, { status: 400 })
        }

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: validation.message
                },
                { status: 400 }
            )
        }
        const { id, task, description, priority, status, dueDate, projectId, memberId } = body;


        const updatedTask = await prisma.task.update({
            where: {
                id
            },
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


        return NextResponse.json({ message: "task Updated Successfully", success: true, task: updatedTask })


    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Update task", success: false, error: err }, { status: 500 })

    }
}