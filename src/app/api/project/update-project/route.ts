import { projectValidation } from "@/src/features/projects/project.schema";
import prisma from "@/src/lib/prisma";
// import { projectValidation } from "@/src/lib/validation/project.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const body = await req.json();
        const validation = projectValidation(body)

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
        const { id, title, description, githubUrl, deadline, status, members } = body;

        const updatedProject = await prisma.project.update({
            where: {
                id
            },
            data: {
                title,
                description,
                githubUrl,
                deadline,
                status,
                members: {
                    connect: members
                }
            }
        })


        return NextResponse.json({ message: "Project Updated Successfully", success: true, project: updatedProject })


    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Update Project", success: false, error: err }, { status: 500 })

    }
}
