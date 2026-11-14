import { Archive, Calendar, CheckCircle2, Clock, ExternalLink, FolderKanban, LucideIcon, PauseCircle } from 'lucide-react';
import React from 'react'
import { Card, CardContent } from '../ui/card';
import { Progress } from '@/src/components/ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import ProjectMenu from './projectMenu';
import { AddProjectMembersButton } from './actionButtons';
import { Project } from '@/src/type/projects';
// import ProjectMembers from './projectMembers';

interface ProjectCardProps {
    project: Project;
    // deleteProject: (id: string) => void;
    // changeStatus: (status: string, id: string) => void
    // handleUpdate: (id: string) => void
}

const ProjectCard: React.FC<ProjectCardProps> = async ({ project }) => {

    // console.log("parent ");

    const statusConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
        active: { label: "Active", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        pending: { label: "Paused", icon: PauseCircle, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
        complete: { label: "Completed", icon: CheckCircle2, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        archived: { label: "Archived", icon: Archive, color: "bg-muted text-muted-foreground border-muted" },
    };

    const status = statusConfig[project.status] ?? statusConfig.active;
    const StatusIcon = status.icon;

    const progressCount = project.tasks.length > 0 ? Math.round((project.tasks.filter((t) => t.status == "completed").length / project.tasks.length) * 100) : 0;



    return (
        <div key={project.id}>
            <Card className="group relative hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer overflow-hidden">
                <div className="h-1.5 absolute top-0 right-0 left-0 w-full" style={{ backgroundColor: project.projectColor ?? "" }} />
                <CardContent className="p-5 space-y-4 relative ">
                    <div className='absolute top-0 right-0'>
                        {/* Actions menu */}
                        <ProjectMenu project={project} />
                    </div>
                    {/* Title row */}
                    <div className="flex items-start justify-betwee relative ">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: project.projectColor + "22" }}
                            // style={{ backgroundColor: 'red' }}
                            >
                                <FolderKanban className="h-4 w-4" style={{ color: project.projectColor ?? "" }} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm truncate">{project.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    {project.description ?? "No description"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progressCount}%</span>
                        </div>
                        <Progress value={progressCount} className="h-1.5" />
                    </div>

                    {/* GitHub link badge */}
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                            // onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                            {/* <Github className="h-3.5 w-3.5" /> */}
                            <span className="truncate max-w-[160px]">
                                {project.githubUrl.replace("https://github.com/", "")}
                            </span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between">
                        {/* Member avatars + add button */}

                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-2">
                                {project.members.slice(0, 3).map((m, i) => (
                                    <Avatar key={i} className="h-6 w-6 border-2 border-card">
                                        <AvatarFallback className="text-[10px]"
                                            style={{ backgroundColor: project.projectColor + "33", color: project.projectColor ?? "" }}
                                        // style={{ color: 'red' }}
                                        >
                                            {/* {String.fromCharCode(65 + i)} */}
                                            {m.name.slice(0, 1).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {(project.members.length ?? 0) > 3 && (
                                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium">
                                        +{(project.members.length ?? 0) - 3}
                                    </div>
                                )}
                            </div>
                            <AddProjectMembersButton defaultMembers={project.members} projectId={project.id} />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {project.deadline && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />{project.tasks.length ?? 0} tasks
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t">
                        <Badge variant="outline" className={`text-[11px] ${status.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />{status.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {project.tasks.filter((t) => t.status == "completed").length ?? 0}/{project.tasks.length ?? 0} done
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}

export default ProjectCard