import prisma from "../lib/prisma";
import { TaskPayload } from "../type/task";

export interface TaskParams {
    status?: string;
    pageNum: number | string,
    pageSize: number;
}


export const taskListService = async (params: TaskParams) => {

    const pageNum = params.pageNum ? Number(params.pageNum) : 1;
    const offset = (pageNum - 1) * params.pageSize;
    const status = params.status ?? 'active';
    // console.log("status :", status);

    const [allTask, total] = await Promise.all([
        prisma.task.findMany({
            take: params.pageSize,
            skip: offset,
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
                        image: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                        githubUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),

        prisma.task.count({
            where: {
                status
            }
        })

    ]);

    return { allTask, total };
};


export const getSingletaskService = async (id: string) => {
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
    });

    return task;

};


export const createtaskService = async (taskPayload: TaskPayload) => {
    const { task, description, priority, status, dueDate, projectId, memberId } = taskPayload;
    const newTask = await prisma.task.create({
        data: {
            task,
            description,
            priority,
            status,
            dueDate,
            projectId,
            memberId

        },
        include: {
            member: {
                select: {
                    name: true,
                    id: true,
                    role: true,
                    // image:true
                }
            },
            project: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    });

    return newTask

}


export const updateTaskService = async (taskPayload: TaskPayload & { id: string }) => {
    const { id, task, description, priority, status, dueDate, projectId, memberId } = taskPayload;


    const updatedTask = await prisma.task.update({
        where: {
            id
        },
        data: {
            task,
            description,
            priority,
            status,
            dueDate,
            projectId,
            memberId

        },
        include: {
            member: {
                select: {
                    name: true,
                    id: true,
                    role: true,
                    // image:true
                }
            },
            project: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    });

    return updatedTask;
};


export const updateTaskStatusService = async (id: string, status: string) => {
    const updatedData = await prisma.task.update({
        where: {
            id
        },
        data: {
            status: status
        },
        select: {
            status: true,
            id: true
        }
    });

    return updatedData;

}


export const deleteTaskService = async (id: string) => {
    const deletedTask = await prisma.task.delete({
        where: {
            id: id
        }
    });

    return deletedTask;
};