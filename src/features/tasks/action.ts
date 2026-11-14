
"use server"

import { requireSession } from "@/src/lib/require_session";
// import { Project, ProjectPayload } from "@/src/type/projects";
// import { projectValidation } from "./project.schema";
// import { addMembersService, createProjectService, deleteProjectService, updateProjectService, updateStatusService } from "@/src/services/projects";
import { revalidatePath } from "next/cache";
import { isMissingRelationError } from "@/src/lib/prisma-errors";
import { TaskPayload } from "@/src/type/task";
import { taskValidation } from "./task.schema";
import { createtaskService, deleteTaskService, updateTaskService, updateTaskStatusService } from "@/src/services/tasks";
import { Task } from "@/src/prisma/generated/client";

export const createTaskAction = async (taskData: TaskPayload):
    Promise<{ error?: string, task?: Task }> => {
    const session = await requireSession();

    if (session.role === 'member') {
        return { error: "Only Admin or Leader Can Create Task" };
    }


    const { success, message } = taskValidation(taskData);
    if (!success) {
        return { error: message || "Please Check The Form Data" };
    };

    try {
        const task = await createtaskService(taskData);
        revalidatePath('/tasks');
        return { task };

    } catch (error) {
        console.error(error);
        return {
            error: "Failed to create Task.",
        };
    }

}



export const updateTaskAction = async (taskData: TaskPayload & { id: string }):
    Promise<{ error?: string, task?: Task }> => {
    const session = await requireSession();

    if (session.role === 'member') {
        return { error: "Only Admin or Leader Can Update Project" };
    }


    const { success, message } = taskValidation(taskData);
    if (!success) {
        return { error: message || "Please Check The Form Data" };
    };

    try {
        const task = await updateTaskService(taskData);
        revalidatePath('/tasks');
        return { task };

    } catch (error) {
        console.error(error);
        return {
            error: "Failed to Update Task.",
        };
    }

}

export const deleteTaskAction = async (id: string):
    Promise<{ error?: string, task?: Task }> => {
    try {
        const session = await requireSession();

        if (session.role === 'member') {
            return { error: "Only Admin or Leader Can Update Project" };
        }

        const response = await deleteTaskService(id);
        revalidatePath('/tasks');
        return { task: response };
    } catch (error) {
        console.error(error);

        if (isMissingRelationError(error)) {
            return { error: "Task Not Found" };
        }

        return {
            error: "Failed to Delete Task.",
        };
    }
}



export const statusChangeAction = async (id: string, status: string):
    Promise<{ error?: string, updatedStatus?: { id: string, status: string } }> => {
    await requireSession();

    try {
        const updatedStatus = await updateTaskStatusService(id, status);
        revalidatePath('/tasks');
        return { updatedStatus }

    } catch (error) {
        console.error(error);

        if (isMissingRelationError(error)) {
            return { error: "Tasks not found" };
        }

        return {
            error: "Failed to Update Tasks status.",
        };
    }

}



// export const addMembersAction = async (
//     members: { id: string }[],
//     projectId: string):
//     Promise<{ error?: string, project?: Project }> => {
//     try {
//         const response = await addMembersService(members, projectId);
//         revalidatePath('/project');
//         return { project: response };
//     } catch (error) {
//         console.error(error);

//         if (isMissingRelationError(error)) {
//             return { error: "Project Not Found" };
//         }

//         return {
//             error: "Failed to Update Project Members.",
//         };
//     }
// }