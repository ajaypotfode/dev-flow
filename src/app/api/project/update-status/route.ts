import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

    try {
        const { id, status } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Id Required", success: false }, { status: 400 })
        }

        if (!status) {
            return NextResponse.json({ message: "Status Required", success: false }, { status: 400 })
        }

        const updatedData = await prisma.project.update({
            where: {
                id
            },
            data: {
                status: status
            },
            select: {
                id: true,
                status: true
            }
        })

        return NextResponse.json({ message: "Status Updated!!", success: true, project: updatedData }, { status: 200 })

    } catch (error) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To update Status", success: false, error: err }, { status: 500 })

    }

}