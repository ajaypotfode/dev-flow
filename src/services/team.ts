import { hash } from "bcrypt";
import prisma from "../lib/prisma";
import { UserPayload } from "../type/user";

export const getTeamListService = async () => {
    const users = await prisma.user.findMany({
        include: {
            tasks: {
                select: {
                    status: true,
                    id: true
                }
            }
        },
        omit: {
            password: true
        }

    });

    const updatedUser = users.map((user) => {
        const completedTasks = user.tasks.filter(task => task.status === 'completed').length;
        const activeTasks = user.tasks.filter(task => task.status === 'active').length;

        const { tasks, ...restdetails } = user
        return {
            ...restdetails,
            progress: {
                totalTasks: user.tasks.length,
                completedTasks,
                activeTasks,
                completionRate: user.tasks.length === 0 ? 0
                    : Math.round((completedTasks / user.tasks.length) * 100),
            },
        }
    });

    return updatedUser;
};


export const getMembersListService = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true
        }
    });

    return users;
};


export const addUserService = async (userPayload: UserPayload) => {
    // const { task, description, priority, status, dueDate, projectId, memberId } = taskPayload;
    // const newTask = await prisma.task.create({
    //     data: {
    //         task,
    //         description,
    //         priority,
    //         status,
    //         dueDate,
    //         projectId,
    //         memberId

    //     },
    //     include: {
    //         member: {
    //             select: {
    //                 name: true,
    //                 id: true,
    //                 role: true,
    //                 // image:true
    //             }
    //         },
    //         project: {
    //             select: {
    //                 id: true,
    //                 title: true,
    //             }
    //         }
    //     }
    // });

    // return newTask


    const { name, email, role, image, status, password, phone } = userPayload;
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (existingUser) {
        throw new Error("User Is Already Exist");
    }


    const stringPass = name.split(" ").join("").slice(0, 4).toLowerCase();
    const lastFourString = phone?.slice(phone.length - 4, phone.length);
    const newpassword = `${stringPass}@${lastFourString}`

    const hashedPassword = await hash(newpassword ?? "", 10)

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            status,
            image
        },
        include: {
            tasks: {
                select: {
                    status: true,
                    id: true
                }
            },
        },
        omit: {
            password: true
        }
    })

    // const updatedUser = users.map((user) => {
    const completedTasks = newUser.tasks.filter(task => task.status === 'completed').length;
    const activeTasks = newUser.tasks.filter(task => task.status === 'active').length;

    const { tasks, ...restdetails } = newUser;

    const result = {
        ...restdetails,
        progress: {
            totalTasks: newUser.tasks.length,
            completedTasks,
            activeTasks,
            completionRate: newUser.tasks.length === 0 ? 0
                : Math.round((completedTasks / newUser.tasks.length) * 100),
        },
    }
    return result;

}



export const updateUserService = async (userPayload: UserPayload) => {

    const { name, email, role, image, status, id } = userPayload;
    const updatedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            email,
            role,
            image,
            status,

        },
        include: {
            tasks: {
                select: {
                    status: true,
                    id: true
                }
            },
        },
        omit: {
            password: true
        }
    });

    return updatedUser

}

