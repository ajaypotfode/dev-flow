// import { calculateTrend } from "../helpers/api/calculateTrend";
import prisma from "../lib/prisma";
import { Member, PieData, SprintData, Stat, TeamData } from "../type/analytics";

type DayType = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
interface TeamDataType {
    memberName: string;
    completed: number;
    inProgress: number;
}

// interface MemberType {
//     memberId: string;
//     memberName: string;
//     // memberAvatar: "/image",
//     completed: number;
//     total: number;
//     completionRate: number;
// };


export const analyticsDataService = async (): Promise<{
    statsData: Stat, sprintData: SprintData[], pieData: PieData[], teamData: TeamData[], members: Member[]
}> => {
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 6)
    const [
        totalTasks,
        weeklyCompletedTask,
        completedTasks,
        overdueTasksCount,
        activeProjects,
        totalProjects,
        tasks,
        pendingTask,
        activeTask,
        users
    ] = await Promise.all([
        // calculate total Task
        prisma.task.count(),

        // calculate this week completed Tasks
        prisma.task.count({
            where: {
                completedAt: {
                    gte: lastWeekDate,
                    lte: new Date()
                },
                status: 'completed'
            }
        }),

        // calculate completed Task
        prisma.task.count({
            where: {
                status: 'completed'
            }
        }),
        // calculate overdue task
        prisma.task.count({
            where: {
                dueDate: {
                    lt: new Date()
                },
                status: {
                    not: "completed"
                }
            }
        }),
        // calculate active project
        prisma.project.count({
            where: {
                status: 'active'
            }
        }),
        // calculate total projects
        prisma.project.count(),

        // get All Task for SprintData
        prisma.task.findMany({
            where: {
                OR: [
                    {
                        createdAt: {
                            gt: lastWeekDate
                        }
                    },
                    {

                        completedAt: {
                            gt: lastWeekDate
                        }
                    }
                ]
            },
            select: {
                createdAt: true,
                completedAt: true
            }
        }),

        // calculate Pending Task
        prisma.task.count({
            where: {
                status: 'pending'
            }
        }),

        // calculate active task 
        prisma.task.count({
            where: {
                status: 'active'
            }
        }),


        prisma.user.findMany({
            select: {
                name: true,
                // image:true,
                id: true,
                tasks: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        })

    ])
    // calculate completion Rate
    const completionRate = Math.round((completedTasks / totalTasks) * 100)

    // this is use to get stats Data****************
    const statsData = {
        totalTasks,
        weeklyCompletedTask,
        completedTasks,
        overdueTasksCount,
        activeProjects,
        totalProjects,
        completionRate
    }

    // ***************************************

    // this is use to get Sprint Data***************************
    const sprintEmptyValue = {
        Sun: { day: "Sun", completed: 0, created: 0 },
        Mon: { day: "Mon", completed: 0, created: 0 },
        Tue: { day: "Tue", completed: 0, created: 0 },
        Wed: { day: "Wed", completed: 0, created: 0 },
        Thu: { day: "Thu", completed: 0, created: 0 },
        Fri: { day: "Fri", completed: 0, created: 0 },
        Sat: { day: "Sat", completed: 0, created: 0 }
    }

    tasks.forEach((task) => {
        if (task.createdAt >= lastWeekDate) {
            const createdDay = new Date(task.createdAt)
                .toLocaleDateString("en-US", {
                    weekday: "short",
                }) as DayType;

            sprintEmptyValue[createdDay].created += 1
            // console.log("created  :",{ [createdDay]: sprintEmptyValue[createdDay].created });

        }

        if (task.completedAt && task.completedAt >= lastWeekDate) {
            const completedDay = new Date(task.completedAt)
                .toLocaleDateString("en-US", {
                    weekday: "short",
                }) as DayType;

            sprintEmptyValue[completedDay].completed += 1
            //  console.log("completed  :",{ [completedDay]: sprintEmptyValue[completedDay].completed });
        }
    })

    const sprintData = Object.values(sprintEmptyValue)

    // ***************************************


    //this is use to get Pie Data*****************************
    const pieData = [
        { name: "Done", value: completedTasks },
        { name: "In Progress", value: activeTask },
        { name: "Pending", value: pendingTask },
        { name: "Overdue", value: overdueTasksCount },
    ];
    // **************************************


    // this is Use To get Team Data and Team Individual Productivity*********************
    const teamData: TeamDataType[] = [];
    const members: Member[] = []

    users.forEach((user) => {

        const completed = user.tasks.filter(task => task.status === 'completed').length
        const active = user.tasks.filter(task => task.status === 'active').length
        const total = user.tasks.length
        // Team Data
        const userData = {
            memberName: user.name,
            completed: completed,
            inProgress: active,
        }
        teamData.push(userData)

        // Team Individual Productivity

        const userProgress = {
            memberId: user.id,
            memberName: user.name,
            // memberAvatar: "/image",
            completed: completed,
            total: total,
            completionRate: Math.round((completed / total) * 100) || 0,
        }

        members.push(userProgress);
    });

    return { statsData, sprintData, pieData, teamData, members };
}