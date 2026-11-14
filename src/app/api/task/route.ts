import prisma from "@/src/lib/prisma";
// import { taskValidation } from "@/src/lib/validation/task.schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const lastId = req.nextUrl.searchParams.get('lastId');
        const limit = 12;
        const status = req.nextUrl.searchParams.get('status') as string;
        const allTask = await prisma.task.findMany({
            take: limit,
            ...(
                lastId && {
                    skip: 1,
                    cursor: { id: lastId }
                }
            ),
            where: {
                status: status
            },
            // select:{
            //   completedAt
            // },
            include: {
                member: {
                    select: {
                        name: true,
                        id: true,
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json({ message: "Tasks Fetched Successfully", success: true, tasks: allTask })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch Tasks", success: false, error: err }, { status: 500 })
    }
}


// export const POST = async (req: NextRequest) => {
//     try {
//         const body = await req.json();

//         const validation = taskValidation(body)

//         // Validation failed
//         if (!validation.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: validation.message
//                 },
//                 { status: 400 }
//             )
//         }

//         const { task, description, priority, status, dueDate, projectId, memberId } = body;

//         const newTask = await prisma.task.create({
//             data: {
//                 task,
//                 description,
//                 priority,
//                 status,
//                 dueDate,
//                 projectId,
//                 memberId

//             },
//             include: {
//                 member: {
//                     select: {
//                         name: true,
//                         id: true,
//                         role: true,
//                         // image:true
//                     }
//                 },
//             }
//         })
//         return NextResponse.json({ message: "Tasks Created Successfully", success: true, task: newTask })

//     } catch (error: unknown) {
//         const err = error instanceof Error ? error.message : "Something went wrong"

//         return NextResponse.json({ message: "Failed To Create Task", success: false, error: err }, { status: 500 })
//     }
// }


// export const UPDATE = async (req: NextRequest) => {
//     try {

//         const body = await req.json();
//         const validation = taskValidation(body)

//         // Validation failed

//         if (!body.id) {
//             return NextResponse.json({ message: "Id is required", success: false }, { status: 400 })
//         }

//         if (!validation.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: validation.message
//                 },
//                 { status: 400 }
//             )
//         }
//       const { id,task, description, priority, status, dueDate, projectId, memberId } = body;


//         const updatedTask = await prisma.task.update({
//             where: {
//                 id
//             },
//             data: {
//                 task,
//                 description,
//                 priority,
//                 status,
//                 dueDate,
//                 projectId,
//                 memberId

//             },
//         })


//         return NextResponse.json({ message: "task Updated Successfully", success: true, task: updatedTask })


//     } catch (error: unknown) {
//         const err = error instanceof Error ? error.message : "Something went wrong"

//         return NextResponse.json({ message: "Failed To Update task", success: false, error: err }, { status: 500 })

//     }
// }