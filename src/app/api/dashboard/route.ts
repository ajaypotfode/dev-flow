import { calculateTrend } from "@/src/helpers/api/calculateTrend";
import prisma from "@/src/lib/prisma"
import { NextResponse } from "next/server"

type DayType = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";


export const GET = async () => {
    // current week
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - 7)
    // last Week
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(previousWeek.getDate() - 7)


    try {
        const [
            totaltask,
            completedTask,
            pendingTask,
            overdueTask,
            trendData,
            weeklyData,
            users
        ] = await Promise.all([
            // total task
            prisma.task.count(),

            // completed task
            prisma.task.count({
                where: {
                    status: 'completed'
                }
            }),

            // pending tasks
            prisma.task.count({
                where: {
                    status: {
                        not: 'completed'
                    }
                }
            }),

            // overdue Task
            prisma.task.count({
                where: {
                    dueDate: {
                        lt: new Date()
                    },
                    status: {
                        not: 'completed'
                    }
                }
            }),

            // this is use for trend
            prisma.task.findMany({
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: previousWeek
                            }
                        },
                        {
                            completedAt: {
                                gte: previousWeek
                            }
                        }
                    ]
                },
                select: {
                    status: true,
                    createdAt: true,
                    completedAt: true,
                    dueDate: true
                }
            }),

            // this is use to calculate Sprint data (Weekly Data)
            prisma.task.findMany({
                where: {
                    status: 'completed',
                    completedAt: {
                        gt: currentWeek
                    }
                },
                select: {
                    completedAt: true
                }
            }),

            // this is use to calculate Team Data
            prisma.user.findMany({
                select: {
                    name: true,
                    // image:true,
                    id: true,
                    tasks: {
                        where: {
                            status: 'completed'
                        },
                        select: {
                            id: true,
                            status: true
                        }
                    }
                }
            })
        ])

        // this is use to get Trend Data Comparing previous and Current week**********************
        const statsMap = {
            total: {
                current: 0,
                previous: 0,
            },

            completed: {
                current: 0,
                previous: 0,
            },

            pending: {
                current: 0,
                previous: 0,
            },

        };

        trendData.forEach((task) => {
            const createdAtTarget = task.createdAt >= currentWeek ? 'current' : "previous";
            const completedTarget = task.completedAt && (task.completedAt >= currentWeek ? 'current' : "previous")
            // total task
            statsMap.total[createdAtTarget] += 1;

            if (completedTarget && task.status === 'completed') {
                statsMap.completed[completedTarget] += 1;
            }

            if (task.status !== "completed") {
                statsMap.pending[createdAtTarget] += 1;
            }
        })


        // stats Data
        const statsData = [
            { title: "Total Tasks", value: totaltask, icon: "totalTask", trend: `${calculateTrend(statsMap.total.current, statsMap.total.previous)} from last week` },
            { title: "Completed Tasks", value: completedTask, icon: "completedTask", trend: `${calculateTrend(statsMap.completed.current, statsMap.completed.previous)} from last week` },
            { title: "Pending Tasks", value: pendingTask, icon: "PendingTask", trend: `${calculateTrend(statsMap.pending.current, statsMap.pending.previous)} from last week` },
            { title: "Overdue Tasks", value: overdueTask, icon: "overdueTask", trend: "Needs attention" },
        ];

        // *******************************

        // this use to calculate Sprint Data**************************
        const sprintEmptyValue = {
            Sun: { day: "Sun", completed: 0 },
            Mon: { day: "Mon", completed: 0 },
            Tue: { day: "Tue", completed: 0 },
            Wed: { day: "Wed", completed: 0 },
            Thu: { day: "Thu", completed: 0 },
            Fri: { day: "Fri", completed: 0 },
            Sat: { day: "Sat", completed: 0 }
        }

        weeklyData.forEach((task) => {
            if (task.completedAt) {
                const completedDay = new Date(task.completedAt)
                    .toLocaleDateString("en-US", {
                        weekday: "short",
                    }) as DayType;

                sprintEmptyValue[completedDay].completed += 1
                //  console.log("completed  :",{ [completedDay]: sprintEmptyValue[completedDay].completed });
            }
        })

        const sprintData = Object.values(sprintEmptyValue)
        // ************************************************


        // this is use to get Team Data
        const teamData = users.map((user) => ({
            memberName: user.name,
            completed: user.tasks.length
        }));

        return NextResponse.json({ message: "Analytics fetched Successfully", success: true, statsData, sprintData, teamData });


    } catch (error) {
        const err = error instanceof Error ? error.message : "Something went wrong"

        return NextResponse.json({ message: "Failed To fetch Projects", success: false, error: err }, { status: 500 })
    }
}