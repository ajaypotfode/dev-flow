"use client";

// import AddForm from "@/src/app/projects/AddForm";
// import UpdateForm from "@/src/app/projects/UpdateForm";
import { Button } from "@/src/components/ui/button";
import { useDynamicModal } from "@/src/context/dynamicModal";
import { useToastModal } from "@/src/context/toastContext";
import { ProjectPayload } from "@/src/type/projects";
import { Pencil, Plus, UserPlus } from "lucide-react";
import ProjectsMembersForm from "./projectMembersForm";
import AddForm from "./AddForm";
// import AddForm from "./AddForm";
// import UpdateForm from "./UpdateForm";

export const CreateProjectButton = () => {
    const { openDynamicModal } = useDynamicModal();
    const { openToast } = useToastModal();

    const handleCreateProject = async () => {
        const response = await openDynamicModal(
            AddForm,
            null
        );
        if (response.message && !response.isError) {
            openToast(response.message, "success")
        }

        if (response.isError && response.message) {
            openToast(response.message, "error")
        }
    }

    return (
        <Button onClick={handleCreateProject} className='flex gap-x-2'><Plus /> New Project</Button>
    )
};



export const AddProjectMembersButton: React.FC<{
    defaultMembers: { id: string, name: string }[],
    projectId: string
}> = ({ defaultMembers, projectId }) => {
    const { openDynamicModal } = useDynamicModal();
    const { openToast } = useToastModal();

    const handleAddMembers = async () => {
        const response = await openDynamicModal(
            ProjectsMembersForm,
            {
                defaultMembers,
                projectId
            }
        );
        if (response.message && !response.isError) {
            openToast(response.message, "success")
        }

        if (response.isError && response.message) {
            openToast(response.message, "error")
        }
    }

    return (
        <Button variant="ghost" size="icon"
            className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/40 hover:border-primary hover:text-primary"
        onClick={e => { e.stopPropagation(); handleAddMembers(); }}
        >
            <UserPlus className="h-3 w-3" />
        </Button>
        // <Button onClick={handleCreateProject} className='flex gap-x-2'><Plus /> New Project</Button>
    )
}


// export const UpdateProjectButton = (project: ProjectPayload & { id: string }) => {
//     const { openDynamicModal } = useDynamicModal();
//     const { openToast } = useToastModal();

//     const handleUpdateProject = async () => {
//         const response = await openDynamicModal(
//             UpdateForm,
//             { project: project }
//         );
//         if (response.message && !response.isError) {
//             openToast(response.message, "success")
//         }

//         if (response.isError && response.message) {
//             openToast(response.message, "error")
//         }
//     }

//     return (
//         <div onClick={handleUpdateProject} className='flex gap-x-2'>  <Pencil className="h-4 w-4 mr-2" />Edit Project</div>
//     )
// }