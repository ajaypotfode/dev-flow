
"use server"

import { requireSession } from "@/src/lib/require_session";
import { ProjectPayload } from "@/src/type/projects";
import { projectValidation } from "./project.schema";
import { addMembersService, checkTaskForProject, createProjectService, deleteProjectService, updateProjectService, updateStatusService } from "@/src/services/projects";
import { revalidatePath } from "next/cache";
import { isMissingRelationError } from "@/src/lib/prisma-errors";
import { Project } from "@/src/type/projects";
import { redirect } from "next/navigation";


export const createProject = async (projectData: ProjectPayload):
    Promise<{ error?: string, project?: Project }> => {
    const session = await requireSession();

    if (session.role === 'member') {
        return { error: "Only Admin or Leader Can Create Project" };
    }


    const { success, message } = projectValidation(projectData);
    if (!success) {
        return { error: message || "Please Check The Form Data" };
    };

    try {
        const project = await createProjectService(projectData);
        revalidatePath('/project');
        return { project };

    } catch (error) {
        console.error(error);
        return {
            error: "Failed to create project.",
        };
    }

}



export const updateProjectAction = async (projectData: ProjectPayload & { id: string }):
    Promise<{ error?: string, project?: Project }> => {
    const session = await requireSession();

    if (session.role === 'member') {
        return { error: "Only Admin or Leader Can Update Project" };
    }


    const { success, message } = projectValidation(projectData);
    if (!success) {
        return { error: message || "Please Check The Form Data" };
    };

    try {
        const project = await updateProjectService(projectData);
        revalidatePath('/project');
        return { project };

    } catch (error) {
        console.error(error);
        return {
            error: "Failed to Update project.",
        };
    }

}

export const deleteProjectAction = async (id: string):
    Promise<{ error?: string, project?: Project }> => {
    try {
        const isTask = await checkTaskForProject(id, "completed");

        if (isTask) {
            return {
                error: "Assigned task Not Completed!",
            };
        }

        const response = await deleteProjectService(id);
        revalidatePath('/project');
        return { project: response };
    } catch (error) {
        console.error(error);

        if (isMissingRelationError(error)) {
            return { error: "Project Not Found" };
        }

        return {
            error: "Failed to Delete Project.",
        };
    }
}



export const statusChangeAction = async (id: string, status: string):
    Promise<{ error?: string, updatedStatus?: { id: string, status: string } }> => {
    const session = await requireSession();

    try {
        const updatedStatus = await updateStatusService(id, status);
        revalidatePath('/project');
        return { updatedStatus }

    } catch (error) {
        console.error(error);

        if (isMissingRelationError(error)) {
            return { error: "School not found" };
        }

        return {
            error: "Failed to Update project status.",
        };
    }

}



export const addMembersAction = async (
    members: { id: string }[],
    projectId: string):
    Promise<{ error?: string, project?: Project }> => {
    try {
        const response = await addMembersService(members, projectId);
        revalidatePath('/project');
        return { project: response };
    } catch (error) {
        console.error(error);

        if (isMissingRelationError(error)) {
            return { error: "Project Not Found" };
        }

        return {
            error: "Failed to Update Project Members.",
        };
    }
}


export const handleSearch = async (formData: FormData) => {
    const q = formData.get("q")?.toString() || "";
    const status = formData.get("status")?.toString() || "all";
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (status) qs.set('status', status);
    redirect(`/projects?${qs.toString()}`);
}