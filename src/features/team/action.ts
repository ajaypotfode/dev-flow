
"use server"

import { requireSession } from "@/src/lib/require_session";
// import { Project, ProjectPayload } from "@/src/type/projects";
// import { projectValidation } from "./project.schema";
// import { addMembersService, createProjectService, deleteProjectService, updateProjectService, updateStatusService } from "@/src/services/projects";
import { revalidatePath } from "next/cache";
import { User, UserPayload } from "@/src/type/user";
import { userValidation } from "./user.schema";
import { addUserService, updateUserService } from "@/src/services/team";

export const createTeamMemberAction = async (teamData: UserPayload):
    Promise<{ error?: string, user?: User }> => {
    const session = await requireSession();

    if (!['leader', 'admin'].includes(session.role)) {
        return { error: "Only Admin/leader Can add Member" };
    }


    const { success, message } = userValidation(teamData);
    if (!success) {
        return { error: message || "Please Check The Form Data" };
    };

    try {
        const response = await addUserService(teamData);
        revalidatePath('/team');
        return { user: response };

    } catch (error) {
        console.error(error);
        return {
            error: error as string || "Failed to Innvite User.",
        };
    }

}



export const updateTeamMemberAction = async (teamData: UserPayload):
    Promise<{ error?: string, user?: User }> => {
    const session = await requireSession();

    if (!['leader', 'admin'].includes(session.role)) {
        return { error: "Only Admin/Leader Can update Member" };
    }


    const { success, message } = userValidation(teamData);
    if (!success) {
        return { error: message || "Please Check The Form Data" };
    };

    try {
        const response = await updateUserService(teamData);
        revalidatePath('/team');
        return { user: response };

    } catch (error) {
        console.error(error);
        return {
            error: error as string || "Failed to Update User.",
        };
    }

}




// export const updateTeamMemberAction = async (taskData: TaskPayload & { id: string }):
//     Promise<{ error?: string, task?: Task }> => {
//     const session = await requireSession();

//     if (session.role === 'member') {
//         return { error: "Only Admin or Leader Can Update Project" };
//     }


//     const { success, message } = taskValidation(taskData);
//     if (!success) {
//         return { error: message || "Please Check The Form Data" };
//     };

//     try {
//         const task = await updateTaskService(taskData);
//         revalidatePath('/tasks');
//         return { task };

//     } catch (error) {
//         console.error(error);
//         return {
//             error: "Failed to Update Task.",
//         };
//     }

// }

// export const deleteTaskAction = async (id: string):
//     Promise<{ error?: string, task?: Task }> => {
//     try {
//         const session = await requireSession();

//         if (session.role === 'member') {
//             return { error: "Only Admin or Leader Can Update Project" };
//         }

//         const response = await deleteTaskService(id);
//         revalidatePath('/tasks');
//         return { task: response };
//     } catch (error) {
//         console.error(error);

//         if (isMissingRelationError(error)) {
//             return { error: "Project Not Found" };
//         }

//         return {
//             error: "Failed to Delete Task.",
//         };
//     }
// }



