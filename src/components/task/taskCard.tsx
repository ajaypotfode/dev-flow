import React from 'react'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { PriorityConfigType, Task } from '@/src/type/task';
import { Calendar } from 'lucide-react';
import TaskMenu from './taskMenu';
import { TaskDetailsButton } from './actionButtons';


interface TaskCardProps {
    task: Task
    priorityConfig: PriorityConfigType;
    currentUser: string
    // taskStatus: { id: string, label: string, color: string }[],
    // deleteTask: (id: string) => void;
    // changeStatus: (status: string, id: string) => void;
    // updatetask: (id: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, priorityConfig, currentUser }) => {

    const pConfig = priorityConfig[task.priority] ?? priorityConfig.medium;
    const PIcon = pConfig.icon;
    return (
        <div
            // initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            // draggable
            //  onDragStart={() => handleDragStart(task as Task)} onDragEnd={handleDragEnd}
            // onClick={() => setSelectedTask(task as Task)}
            className={`bg-card relative border rounded-lg p-3 cursor-grab active:cursor-grabbing select-none hover:shadow-md hover:border-primary/20 transition-all duration-150 group`} >
            {/* ${dragging?.id === task.id ? "opacity-40 scale-95" : ""}`} */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">{task.task}</p>
                <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${pConfig.bg}`}>
                    <PIcon className="h-2.5 w-2.5 mr-0.5" />{pConfig.label}
                </Badge>
            </div>
            {task.project.title && (
                <p className="text-xs text-muted-foreground mb-2">{task.project.title}</p>
            )}
            {/* {(task.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {(task.tags ?? []).slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{tag}</Badge>
                    ))}
                </div>
            )} */}
            <div className="flex items-center justify-between pt-1 mt-1 border-t border-muted/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {task.dueDate && (
                        <span className="flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                    )}
                </div>
                {task.member.name && (
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={task.member.image ?? undefined} />
                        <AvatarFallback className={`text-[9px] ${pConfig.bg}`}>{task.member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                )}
            </div>

            <div className="flex justify-between items-center gap-1 mt-2 pt-1.5 border-t border-muted/40">

                {/* <div className='absolute top-0 right-0'> */}
                {/* Actions menu */}
                <TaskMenu task={task} />
                {/* </div> */}

                <TaskDetailsButton task={task} currentUser={currentUser} />

            </div>
        </div>
    )
}

export default TaskCard