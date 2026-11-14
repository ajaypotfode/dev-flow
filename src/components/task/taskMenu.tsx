"use client"
import { Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Task, TaskPayload } from '@/src/type/task';
import { useToastModal } from '@/src/context/toastContext';
import { useDynamicModal } from '@/src/context/dynamicModal';
import { useRouter } from 'next/navigation'
import { deleteTaskAction, statusChangeAction } from '@/src/features/tasks/action';
import UpdateTaskForm from './UpdateTask';
import Confirmation from '../custome/confirmation';


interface TaskMenuProps {
    task: Task
}

const TaskMenu = ({ task }: TaskMenuProps) => {
    const { openToast } = useToastModal();
    const { openDynamicModal } = useDynamicModal();
    const router = useRouter();

    const COLUMNS = [
        // { id: "todo", label: "Todo", color: "#9CA3AF" },
        { id: "active", label: "In Progress", color: "#F59E0B" },
        { id: "pending", label: "pending", color: "#3B82F6" },
        { id: "completed", label: "Done", color: "#10B981" },
    ];



    const changeStatus = async (status: string, id: string) => {
        const response = await statusChangeAction(id, status);

        if (!response.error) {
            // close({isError:false, message: "Project Created Successfully!!" });
            router.refresh();
            openToast("Status Update Successfully!!", 'success');
            return
        };

        openToast(response.error, 'error')
    }



    const handleUpdateTask = async (task: TaskPayload & { id: string }) => {
        const response = await openDynamicModal(
            UpdateTaskForm,
            { task }
        );
        if (response.message && !response.isError) {
            openToast(response.message, "success")
        }

        if (response.isError && response.message) {
            openToast(response.message, "error")
        }
    };


    const handleDeleteTask = async (id: string, name: string) => {
        // console.log("project color  :", payload);
        const modalResponse = await openDynamicModal(
            Confirmation,
            {
                title: "delete This task",
                description: `Are You sure you want to delete "${name}" this Task? And all Associated data will be permanently removed`,
                contentName: name
            }
        )

        if (modalResponse.isError) {
            return;
        }



        const response = await deleteTaskAction(id);
        // setProjects([...projects, response.data.project])

        if (!response.error) {
            // close({isError:false, message: "Project Created Successfully!!" });
            router.refresh();
            openToast("Task Deleted Successfully!!", 'success');
            return
        };

        openToast(response.error, 'error')
    };
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-100 flex-shrink-0">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit' align="end">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">Change Status</DropdownMenuLabel>
                {COLUMNS.map((status) => {
                    // const Icon = status.icon;
                    return (
                        <DropdownMenuItem key={status.id}
                            disabled={status.id === task.status}
                            className="gap-2"
                            onClick={(e) => {
                                e.preventDefault();
                                changeStatus(status.id, task.id)
                            }}
                        // onClick={async () => {
                        //     await updateProject.mutateAsync({ id: project.id, data: { status: key as any } });
                        //     qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
                        // }}
                        >
                            <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: status.color }}
                            />
                            <span className="flex-1">
                                {status.label}
                            </span>
                            {task.status === status.id && (
                                <Check className="h-3 w-3 text-primary" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpdateTask({
                    id: task.id,
                    task: task.task,
                    status: task.status,
                    description: task.description ?? "",
                    dueDate: task.dueDate,
                    priority: task.priority,
                    projectId: task.projectId,
                    memberId: task.memberId
                })}>
                    <Pencil className="h-4 w-4 mr-2" />Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => { e.preventDefault(); handleDeleteTask(task.id, task.task) }}
                >
                    <Trash2 className="h-4 w-4 mr-2" />Delete Task
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TaskMenu