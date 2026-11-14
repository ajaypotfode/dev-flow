import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) => {
    try {

        const { taskId } = await params;

        const task = await prisma.task.findFirst({
            where: {
                id: taskId
            },
            include: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        // image: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                        githubUrl: true
                    }
                }
            }
        })

        return NextResponse.json({ message: "Task Fetched Successfully", success: true, task: task })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch Task", success: false, error: err }, { status: 500 })
    }

}