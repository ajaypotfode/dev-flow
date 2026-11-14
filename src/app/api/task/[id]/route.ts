import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {

        const { id } = await params;

        const task = await prisma.task.findFirst({
            where: {
                id
            },
            include: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        // image: true
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

        return NextResponse.json({ message: "Task Fetched Successfully", success: true, task: task })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch Task", success: false, error: err }, { status: 500 })
    }

}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;

        const deletedTask = await prisma.task.delete({
            where: {
                id: id
            }
        })
        return NextResponse.json({ message: "Task Deleted Successfully", success: true, task: deletedTask })


    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Delete Task", success: false, error: err }, { status: 500 })

    }
}