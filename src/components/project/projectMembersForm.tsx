"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Skeleton } from '../ui/skeleton'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { Button } from '../ui/button'
import { Plus, UserMinus, UserPlus, X } from 'lucide-react'
import { Team } from '@/src/type/user'
import apiClient from '@/src/axios/axios'
import { ModalComponentType } from '@/src/context/dynamicModal'
import { addMembersAction } from '@/src/features/projects/action'
import { useRouter } from 'next/navigation'

interface Result {
    isError: boolean;
    message?: string;
}

interface ProjectsMembersFormProps {
    defaultMembers: { id: string, name: string }[];
    projectId: string;
}

const ProjectsMembersForm: React.FC<ModalComponentType<Result, ProjectsMembersFormProps>> = ({ close, props }) => {
    const membersLoading = false
    const { defaultMembers, projectId } = props;
    const router = useRouter();
    const [members, setMembers] = useState<Team[]>([]);
    // const [filteredMembers, setFilteredMembers] = useState<Team[]>([]);
    const [projectMembers, setProjectMembers] = useState(defaultMembers)
    const [isLoading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`/api/team`);
            setMembers(response.data.team);

            setLoading(false);
            console.log("response is  :", response);

        } catch (error) {
            setLoading(false)
            console.log("error  :", error);
        }

    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    // const updateProjectMembers = async (payload: { id: string }[]) => {

    //     try {

    //         const response = await apiClient.post(`/api/project/add-members`,
    //             { members: payload, id: projectId }
    //         );
    //         // setMembers(response.data.team);

    //         setLoading(false);
    //         console.log("response is  :", response.data.project);
    //         return response.data.project.members


    //     } catch (error) {
    //         setLoading(false);
    //         console.log("error  :", error);
    //         return null
    //     }
    // }

    const addMembers = async (id: string) => {
        // const checkId = projectData.members.find(m => m.id === id);
        // if (checkId) return;


        const members = projectMembers.map(member => { return { id: member.id } });
        const newMembers = [...members, { id: id }]
        const response = await addMembersAction(newMembers, projectId);
        // setProjects([...projects, response.data.project])
        setLoading(false);

        if (!response.error) {
            close({ isError: false, message: "Members Added Successfully!!" });
            router.refresh();
            return;
        }
        close({ isError: true, message: response.error });
    }



    const removeMember = async (id: string) => {

        const members = projectMembers.filter(member => member.id !== id)
            .map(member => { return { id: member.id } })


        const response = await addMembersAction(members, projectId);
        // setProjects([...projects, response.data.project])
        setLoading(false);

        if (!response.error) {
            close({ isError: false, message: "Members Removed Successfully!!" });
            router.refresh();
            return;
        }
        close({ isError: true, message: response.error });
    }

    // console.log("filterd Members  :", );
    // console.log("child ");


    const filteredMembers = members.filter(m => !projectMembers.some(pm => pm.id === m.id));
    // console.log("filterd Members  :", filteredMembers);



    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-700/50 backdrop-blur-sm"
                onClick={() => close({ isError: true, })}
            />

            <div className="bg-background p-6 rounded-lg
            shadow-lg z-10 max-w-sm w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-foreground text-xl font-bold mb-2">
                        Add Project
                    </h3>
                    <button onClick={() => close({ isError: true, })}>
                        <X className="w-6 h-6 drop-shadow
                        text-foreground cursor-pointer"></X>
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Current members */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {/* Current Members ({(projectMembers ?? []).length}) */}
                            Current Members 7
                        </p>
                        {membersLoading ? (
                            <div className="space-y-2">{[0, 1].map(i => <Skeleton key={i} className="h-10" />)}</div>
                        ) : (projectMembers ?? []).length === 0 ? (
                            <p className="text-xs text-muted-foreground py-2">No members yet.</p>
                        ) : (
                            <div className="space-y-1.5">
                                {(projectMembers ?? []).map((m, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                {m.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{m.name}</p>
                                            {/* <p className="text-xs text-muted-foreground truncate">{m.role}</p> */}
                                        </div>
                                        <Button type='button' variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeMember(m.id)}
                                        >
                                            <UserMinus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add members */}
                    {filteredMembers.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Add Members
                            </p>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                {filteredMembers.map((m, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback className="text-[10px]">

                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{m.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                                        </div>
                                        <Button type='button' variant="outline" size="sm" className="h-7 text-xs"
                                            onClick={() => addMembers(m.id)}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />Add
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ProjectsMembersForm