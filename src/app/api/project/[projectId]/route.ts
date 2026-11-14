import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) => {
    try {
        const { projectId } = await params
        //  title, description, githubUrl, deadline, status, members
        const project = await prisma.project.findFirst({
            where: {
                id: projectId
            },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        })
        return NextResponse.json({ message: "Project Fetched Successfully", success: true, project: project })


    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Fetch Project", success: false, error: err }, { status: 500 })

    }
}


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) => {
    try {
        const { projectId } = await params;

        const deletedProject = await prisma.project.delete({
            where: {
                id: projectId
            }
        })
        return NextResponse.json({ message: "Project Deleted Successfully", success: true, project:  deletedProject })


    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Delete Project", success: false, error: err }, { status: 500 })

    }
}