import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        // const purpose = req.nextUrl.searchParams.get('purpose');

        // this is use to get all Team Member, for referencing
        // if (purpose && purpose === 'reference') {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: "admin"
                }
            },
            select: {
                id: true,
                name: true
            }
        })

        return NextResponse.json({ message: "users Fetched Successfully", success: true, team: users })
        // }


        // const users = await prisma.user.findMany({
        //     include: {
        //         tasks: {
        //             select: {
        //                 status: true,
        //                 id: true
        //             }
        //         },
        //         // password: false
        //     }
        // });

        // const updatedUser = users.map((user) => {
        //     const completedTasks = user.tasks.filter(task => task.status === 'completed').length;
        //     const activeTasks = user.tasks.filter(task => task.status === 'active').length;

        //     const { tasks, ...restdetails } = user
        //     return {
        //         ...restdetails,
        //         progress: {
        //             totalTasks: user.tasks.length,
        //             completedTasks,
        //             activeTasks,
        //             completionRate: user.tasks.length === 0 ? 0
        //                 : Math.round((completedTasks / user.tasks.length) * 100),
        //         },
        //     }
        // })

        // return NextResponse.json({ message: "users Fetched Successfully", success: true, team: updatedUser })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch users", success: false, error: err }, { status: 500 })
    }
}
