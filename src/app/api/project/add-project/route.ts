import { projectValidation } from "@/src/features/projects/project.schema";
import prisma from "@/src/lib/prisma";
// import { projectValidation } from "@/src/lib/validation/project.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const body = await req.json();
        const validation = projectValidation(body)

        // Validation failed
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: validation.message
                },
                { status: 400 }
            )
        }
        const { title, description, githubUrl, deadline, status, members, projectColor } = body;

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                githubUrl,
                deadline,
                status,
                members: {
                    connect: members
                },
                projectColor
            },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                },
                tasks: {
                    select: {
                        status: true
                    }
                }
            }
        });

        const completedTasks = newProject.tasks.reduce((count, task) => task.status === 'completed' ? count + 1 : count, 0)

        const result = { ...newProject, completedTasks }

        return NextResponse.json({ message: "Projects Created Successfully", success: true, project: result })


    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Create Project", success: false, error: err }, { status: 500 })

    }
}
