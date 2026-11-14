import prisma from "@/src/lib/prisma";
// import { projectValidation } from "@/src/lib/validation/project.schema";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    try {
        const lastId = req.nextUrl.searchParams.get('lastId');
        const purpose = req.nextUrl.searchParams.get('purpose');
        const limit = 9;

        // this is use to get all projects, for referencing
        if (purpose && purpose === 'reference') {
            const projects = await prisma.project.findMany({
                select: {
                    id: true,
                    title: true
                }
            })

            return NextResponse.json({ message: "Projects Fetched Successfully", success: true, projects: projects })
        }


        // this is use to diaplay all Projects 
        const projects = await prisma.project.findMany({
            take: limit,
            ...(lastId &&
            {
                skip: 1,//this is to skip current id
                cursor: { id: lastId }
            }
            ),
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // console.log("projects :", projects);

        const result = projects.map((project) => {
            const totalTasks = project.tasks.length;
            // const completedTasks = project.tasks.filter(task => task.status === 'completed').length
            const completedTasks = project.tasks.reduce((count, task) => task.status === 'completed' ? count + 1 : count, 0)

            const { tasks: _, ...filteredTask } = project

            return {
                ...filteredTask,
                totalTasks,
                completedTasks
            }
        })

        return NextResponse.json({ message: "Projects Fetched Successfully", success: true, projects: result })

    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch Projects", success: false, error: err }, { status: 500 })
    }
}


// export const POST = async (req: NextRequest) => {
//     try {

//         const body = await req.json();
//         const validation = projectValidation(body)

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
//         const { title, description, githubUrl, deadline, status, members } = body;

//         const newProject = await prisma.project.create({
//             data: {
//                 title,
//                 description,
//                 githubUrl,
//                 deadline,
//                 status,
//                 members: {
//                     connect: members
//                 }
//             }
//         });

//         return NextResponse.json({ message: "Projects Created Successfully", success: true, project: newProject })


//     } catch (error: unknown) {
//         const err = error instanceof Error ? error.message : "Something went wrong"

//         return NextResponse.json({ message: "Failed To Create Project", success: false, error: err }, { status: 500 })

//     }
// }


// export const UPDATE = async (req: NextRequest) => {
//     try {

//         const body = await req.json();
//         const validation = projectValidation(body)

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
//         const { id, title, description, githubUrl, deadline, status, members } = body;

//         const updatedProject = await prisma.project.update({
//             where: {
//                 id
//             },
//             data: {
//                 title,
//                 description,
//                 githubUrl,
//                 deadline,
//                 status,
//                 members
//             }
//         })


//         return NextResponse.json({ message: "Project Updated Successfully", success: true, project: updatedProject })


//     } catch (error: unknown) {
//         const err = error instanceof Error ? error.message : "Something went wrong"

//         return NextResponse.json({ message: "Failed To Update Project", success: false, error: err }, { status: 500 })

//     }
// }
