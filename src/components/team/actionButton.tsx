
"use client";
import { useDynamicModal } from "@/src/context/dynamicModal";
import { Button } from "../ui/button";
import { useToastModal } from "@/src/context/toastContext";
import AddMemberForm from "./AddTeamMember";
import { Plus } from "lucide-react";

export const InviteMemberButton = () => {
    const { openDynamicModal } = useDynamicModal();
    const { openToast } = useToastModal();

    const handleCreateTeam = async () => {
        const response = await openDynamicModal(
            AddMemberForm,
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
        <Button onClick={handleCreateTeam} className='flex gap-x-2'><Plus />Invite Member</Button>
    )
};
