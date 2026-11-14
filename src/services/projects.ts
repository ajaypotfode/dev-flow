import prisma from "../lib/prisma";
import { Prisma } from "../prisma/generated/browser";
import { Project, ProjectPayload } from "../type/projects";

export interface ProjectParams {
    // cursorId?: string;
    // // purpose?: string;
    // cursorCreatedAt?: string;
    // direction?: 'next' | 'prev';
    pageSize: number;
    q?: string
    status?: "complete" | "pending" | "active" | "all";
    pageNum: number | string,

}

export interface ProjecttResult {
    projects: Project[];
    total: number;
}


// export const getProjectListService = async (params: ProjectParams) => {
//     const limit = 2;
//     // const purpose = params.purpose;

//     const isPrevious = params.cursorId && params.direction === "prev";

//     console.log("created at : ", params.cursorCreatedAt);

//     // const take = isPrevious ? -limit : limit;

//     const where: Prisma.ProjectWhereInput = {
//         ... (params.q ? {
//             title: {
//                 contains: params.q,
//                 mode: "insensitive"
//             }
//         } : {}
//         ),

//         ...((params.status && params.status !== "all") ?
//             {
//                 status: params.status
//             } : {})
//     }


//     const sortOrder = isPrevious ? 'asc' : 'desc';

//     const [projects, total] = await Promise.all([
//         prisma.project.findMany(
//             {
//                 where,
//                 take: limit,
//                 ...(
//                     (params.cursorId && params.cursorCreatedAt) && {
//                         skip: 1,//this is to skip current id
//                         cursor: {
//                             project_createdAt_id: {
//                                 id: params.cursorId,
//                                 createdAt: new Date(params.cursorCreatedAt)
//                             }
//                         }
//                     }
//                 ),
//                 include: {
//                     members: {
//                         select: {
//                             id: true,
//                             name: true,
//                             role: true
//                         }
//                     },
//                     tasks: {
//                         select: {
//                             status: true
//                         }
//                     }
//                 },
//                 orderBy: [
//                     { createdAt: sortOrder },
//                     { id: sortOrder }
//                 ]
//             }
//         ),

//         prisma.project.count({ where })
//     ]
//     )

//     // const hasItem=/


//     const lastId = projects[projects.length - 1]?.id ?? null
//     const firstId = projects[0]?.id ?? null
//     const lastCreatedAt = projects[projects.length - 1]?.createdAt?.toISOString() ?? null
//     const firstCraetdAt = projects[0]?.createdAt?.toISOString() ?? null

//     return { projects, total, metaData: { lastId, firstId, firstCraetdAt, lastCreatedAt } };

// };




export const getProjectListService = async (params: ProjectParams) => {

    const pageNum = params.pageNum ? Number(params.pageNum) : 1;
    const offset = (pageNum - 1) * params.pageSize;
    // console.log("pageNum  :", pageNum);


    // const take = isPrevious ? -limit : limit;

    const where: Prisma.ProjectWhereInput = {
        ... (params.q ? {
            title: {
                contains: params.q,
                mode: "insensitive"
            }
        } : {}
        ),

        ...((params.status && params.status !== "all") ?
            {
                status: params.status
            } : {})
    }

    const [projects, total] = await Promise.all([
        prisma.project.findMany(
            {
                where,
                take: params.pageSize,
                skip: offset,
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
                orderBy: [
                    { createdAt: "desc" },
                    // { id:"desc" }
                ]
            }
        ),

        prisma.project.count({ where })
    ]
    )

    // const hasItem=/


    return { projects, total };

};



export const getProjectsService = async () => {
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            title: true
        }
    });

    return projects
};


export const createProjectService = async (payload: ProjectPayload) => {
    const [project, totalTasks] = await Promise.all([
        prisma.project.create({
            data: {
                title: payload.title,
                description: payload.description,
                githubUrl: payload.githubUrl,
                deadline: payload.deadline,
                status: payload.status,
                members: {
                    connect: payload.members
                },
                projectColor: payload.projectColor
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
        }),

        prisma.project.count()
    ])

    const completedTasks = project.tasks.reduce((count, task) => task.status === 'completed' ? count + 1 : count, 0)

    const result = { ...project, totalTasks, completedTasks }

    return result;
};

export const updateProjectService = async (payload: ProjectPayload & { id: string }) => {
    const updatedProject = await prisma.project.update({
        where: {
            id: payload.id
        },
        data: {
            title: payload.title,
            description: payload.description,
            githubUrl: payload.githubUrl,
            deadline: payload.deadline,
            status: payload.status,
            members: {
                connect: payload.members
            }
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

    return updatedProject
};


export const updateStatusService = async (id: string, status: string) => {
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
    });

    return updatedData;
};

export const getSingleProjectService = async (id: string) => {
    const project = await prisma.project.findFirst({
        where: {
            id
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
    });

    return project;
};

export const deleteProjectService = async (id: string) => {
    const deletedProject = await prisma.project.delete({
        where: {
            id
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

    return deletedProject;
};

export const addMembersService = async (members: { id: string }[], id: string) => {
    const updatedData = await prisma.project.update({
        where: {
            id
        },
        data: {
            members: {
                set: members
            }
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

    return updatedData;
}

export const checkTaskForProject = async (id: string, status: string) => {
    const tasks = await prisma.task.findFirst({
        where: {
            projectId: id,
            status: {
                not: status
            }
        },
        select: {
            id: true,
            status: true
        }
    })

    return !!tasks;
}