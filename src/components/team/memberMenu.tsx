"use client"
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useDynamicModal } from '@/src/context/dynamicModal';
import UpdateMemberForm from './UpdateTeamMember';
import { User } from '@/src/type/user';
import { useToastModal } from '@/src/context/toastContext';
// import UpdateTaskForm from './UpdateTask';


interface MemberMenuProps {
    member: User & { id: string }
}

const MemberMenu = ({ member }: MemberMenuProps) => {
    const { openToast } = useToastModal();
    const { openDynamicModal } = useDynamicModal();


    const handleUpdateMember = async (member: User & { id: string }) => {
        const response = await openDynamicModal(
            UpdateMemberForm,
            { member }
        );
        if (response.message && !response.isError) {
            openToast(response.message, "success")
        }

        if (response.isError && response.message) {
            openToast(response.message, "error")
        }
    };


    // const handleDeleteMember = async (id: string) => {
    //     // console.log("project color  :", payload);
    //     const response = await deleteTaskAction(id);
    //     // setProjects([...projects, response.data.project])

    //     if (!response.error) {
    //         // close({isError:false, message: "Project Created Successfully!!" });
    //         router.refresh();
    //         openToast("Status Update Successfully!!", 'success');
    //         return
    //     };

    //     openToast(response.error, 'error')
    // };

    // const statusCfg = STATUS_CONFIG[member.status ?? "offline"] ?? STATUS_CONFIG.offline;
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-100 flex-shrink-0">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit' align="end">
                <DropdownMenuItem
                    onClick={() => handleUpdateMember({
                        id: member.id,
                        name: member.name,
                        email: member.email,
                        role: member.role,
                        status: member.status,
                        image: member.image
                    })}
                >
                    <Pencil className="h-4 w-4 mr-2" />Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                // onClick={(e) => { e.preventDefault(); deleteMember(member.id) }}
                >
                    <Trash2 className="h-4 w-4 mr-2" />Delete Project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MemberMenu;