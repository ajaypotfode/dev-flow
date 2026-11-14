import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { members, id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "ProjectId Required", success: false }, { status: 400 })
        }

        if (!members.length) {
            return NextResponse.json({ message: "Atleast One Member Required", success: false }, { status: 400 })
        }


        const updatedData = await prisma.project.update({
            where: {
                id
            },
            data: {
                members: {
                    set: members
                }
            },
            select: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        })

        return NextResponse.json({ message: "Members Added Successfully!!", success: true, project: updatedData }, { status: 200 })

    } catch (error) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To Add Members", success: false, error: err }, { status: 500 })

    }

}