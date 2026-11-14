
"use client";
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Archive, CheckCircle2, LucideIcon, MoreHorizontal, PauseCircle, Pencil, Trash2, Users } from 'lucide-react';
import { Project, ProjectPayload } from '@/src/type/projects';
// import { UpdateProjectButton } from './actionButtons';
import { deleteProjectAction, statusChangeAction } from '@/src/features/projects/action';
import { useToastModal } from '@/src/context/toastContext';
import { useRouter } from 'next/navigation';
import { useDynamicModal } from '@/src/context/dynamicModal';
import UpdateForm from './UpdateForm';
import Confirmation from '../custome/confirmation';
// import { Project } from '@/src/prisma/generated/client';
// import UpdateForm from '@/src/app/projects/UpdateForm';

interface ProjectMenuProps {
    project: Project
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ project }) => {
    const { openToast } = useToastModal();
    const { openDynamicModal } = useDynamicModal();
    const router = useRouter();

    const statusConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
        active: { label: "Active", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        pending: { label: "Paused", icon: PauseCircle, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
        complete: { label: "Completed", icon: CheckCircle2, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        // archived: { label: "Archived", icon: Archive, color: "bg-muted text-muted-foreground border-muted" },
    };


    const changeStatus = async (id: string, status: string) => {
        const response = await statusChangeAction(id, status);

        if (!response.error) {
            // close({isError:false, message: "Project Created Successfully!!" });
            router.refresh();
            openToast("Status Update Successfully!!", 'success');
            return
        };

        openToast(response.error, 'error')
    }



    const handleUpdateProject = async (project: ProjectPayload & { id: string }) => {
        const response = await openDynamicModal(
            UpdateForm,
            { project: project }
        );
        if (response.message && !response.isError) {
            openToast(response.message, "success")
        }

        if (response.isError && response.message) {
            openToast(response.message, "error")
        }
    };


    const handleDeleteProject = async (id: string, name: string) => {
        // console.log("project color  :", payload);
        
        const modalResponse = await openDynamicModal(
            Confirmation,
            {
                title: "delete This Project",
                description: `Are You sure you want to delete "${name}"? And all Associated Tasks will be permanently removed`,
                contentName: name
            }
        )

        if (modalResponse.isError) {
            return;
        }

        const response = await deleteProjectAction(id);
        // setProjects([...projects, response.data.project])

        if (!response.error) {
            // close({isError:false, message: "Project Created Successfully!!" });
            router.refresh();
            openToast("Project Deleted Successfully!!", 'success');
            return
        };

        openToast(response.error, 'error')
    };


    // const projectStatus = statusConfig[status] ?? statusConfig.active;
    // const StatusIcon = projectStatus.icon;
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-100 flex-shrink-0">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit' align="end">
                <DropdownMenuItem className=' whitespace-nowrap  ' /*onClick={() => setMembersProjectId(project.id)}*/>
                    <Users className="h-4 w-4 mr-2" />Manage Members
                </DropdownMenuItem>
                {/* {project.githubRepoUrl && (
                                    <DropdownMenuItem asChild>
                                        <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-4 w-4 mr-2" />View Repository
                                        </a>
                                    </DropdownMenuItem>
                                )} */}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">Change Status</DropdownMenuLabel>
                {Object.entries(statusConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                        <DropdownMenuItem key={key}
                            disabled={key === project.status}
                            className="gap-2"
                            onClick={(e) => {
                                e.preventDefault();
                                changeStatus(project.id, key)
                            }}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{cfg.label}</span>
                            {project.status === key && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleUpdateProject({
                        projectColor: project.projectColor ?? '',
                        title: project.title,
                        deadline: project.deadline,
                        description: project.description ?? "",
                        status: project.status,
                        members: project?.members,
                        githubUrl: project.githubUrl ?? "",
                        id: project.id,
                    })}
                >
                    {/* <UpdateProjectButton
                        projectColor={project.projectColor}
                        title={project.title}
                        deadline={project.deadline}
                        description={project.description}
                        status={project.status}
                        members={project.members}
                        githubUrl={project.githubUrl ?? ""}
                        id={project.id}
                    /> */}

                    <Pencil className="h-4 w-4 mr-2" />Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {  handleDeleteProject(project.id, project.title) }}
                >
                    <Trash2 className="h-4 w-4 mr-2" />Delete Project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProjectMenu