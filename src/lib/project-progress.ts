import prisma from "./prisma"

interface TaskReturnType {
    status: "active" | "in_progress" | "completed"
}

const WEIGHT_COUNT = {
    active: 0,
    in_progress: 50,
    completed: 100
}


export const progressCount = async (projectId: string) => {
    const totalTask = await prisma.task.findMany({
        where: {
            projectId
        },
        select: {
            status: true
        }
    }) as TaskReturnType[]

    if (totalTask.length === 0) {
        return 0
    }

    const totalCount = totalTask.reduce((prev, task) => {
        const total = prev + WEIGHT_COUNT[task.status]
        return total
    }, 0);
    
    return ((totalTask.length / totalCount) * 100)
}