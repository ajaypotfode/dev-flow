"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Textarea } from '@/src/components/ui/textarea';
import { Project } from '@/src/type/projects';
import { Team, User } from '@/src/type/user';
import apiClient from '@/src/axios/axios';
import { Task, TaskPayload } from '@/src/type/task';
import { ModalComponentType } from '@/src/context/dynamicModal';
import { updateTaskAction } from '@/src/features/tasks/action';
import { useRouter } from 'next/navigation';


interface UpdateFormProps {
    task: TaskPayload & { id: string };
}

interface Result {
    isError: boolean;
    message?: string;
}
const UpdateTaskForm: React.FC<ModalComponentType<Result, UpdateFormProps>> = ({ close, props }) => {
    const { task } = props
    const router = useRouter();
    const [taskForm, setTaskForm] = useState({
        title: task.task,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assigneeId: task.memberId,
        dueDate: task.dueDate.toISOString().split("T")[0]
    })

    const [projects, setProjects] = useState<Project[]>([]);
    const [members, setMembers] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // const [project]

    const fetchProjectData = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`/api/project?purpose=reference`);
            setProjects(response.data.projects)
            setLoading(false);
            console.log("response is  :", response);

        } catch (error) {
            setLoading(false)
            console.log("error  :", error);
        }

    };



    const fetchMembersData = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`/api/team?purpose=reference`);
            setMembers(response.data.team)
            setLoading(false);
            console.log("response is  :", response);

        } catch (error) {
            setLoading(false)
            console.log("error  :", error);
        }

    }


    // const handleEdit = async () => {
    //     try {
    //         const response = await apiClient.get(`/api/task/${taskId}`);
    //         // setProjects(response.data.projects);
    //         const { task } = response.data
    //         const result = {
    //             title: task.task ?? "",
    //             description: task.description ?? '',
    //             dueDate: new Date(task.dueDate),
    //             status: task.status,
    //             assigneeId: task.memberId,
    //             projectId: task.projectId,
    //             priority: task.priority
    //         }

    //         console.log("project id :", task.projectId);

    //         setTaskForm(result);
    //         // setLoading(false);
    //         // console.log("response is  :", response);

    //     } catch (error) {
    //         // setLoading(false)
    //         console.log("error  :", error);
    //     }
    // }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMembersData();
        fetchProjectData();
    }, []);


    const submitTask = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const isValid =
            taskForm.title.trim() !== "" &&
            taskForm.description.trim() !== "" &&
            taskForm.priority !== "" &&
            taskForm.dueDate !== null &&
            taskForm.projectId !== "" &&
            taskForm.assigneeId !== "" &&
            taskForm.status

        if (!isValid) {
            // show error
            setError("Please fill in all required fields.");
            return;
        }

        const payload = {
            id: task.id,
            task: taskForm.title,
            description: taskForm.description,
            priority: taskForm.priority,
            dueDate: new Date(taskForm.dueDate),
            projectId: taskForm.projectId,
            memberId: taskForm.assigneeId,
            status: taskForm.status
        }
        // console.log("project color  :", payload);

        const response = await updateTaskAction(payload);
        // setProjects([...projects, response.data.project])
        setLoading(false);
        if (!response.error) {
            close({ isError: false, message: "Task Updated Successfully!!" });
            router.refresh();
            return;
        }
        close({ isError: true, message: response.error });
    }


    const priority = ["urgent", "high", "medium", "low"]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-700/50 backdrop-blur-sm"
                onClick={() => close({ isError: false })}
            />

            <div className="bg-background p-6 rounded-lg
            shadow-lg z-10 max-w-sm w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-foreground text-xl font-bold mb-2">
                        Update Task
                    </h3>
                    <button onClick={() => close({ isError: false })}>
                        <X className="w-6 h-6 drop-shadow text-foreground cursor-pointer"></X>
                    </button>
                </div>

                {
                    error && <p className='text-red-600 '>{error}</p>
                }

                <form className="space-y-4 py-1 text-foreground " onSubmit={submitTask}>
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label>Title <span className="text-destructive">*</span></Label>
                        <Input placeholder="Task title" value={taskForm.title}
                            onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea placeholder="Describe the task…" className="resize-none min-h-[80px]"
                            value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
                    </div>

                    {/* Project + Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Project <span className="text-destructive">*</span></Label>
                            <Select value={taskForm.projectId} onValueChange={v => setTaskForm(f => ({ ...f, projectId: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                                <SelectContent>
                                    {(projects ?? []).map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status <span className="text-destructive">*</span></Label>
                            <Select value={taskForm.status} onValueChange={v => setTaskForm(f => ({ ...f, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {["active", "pending", "completed"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Priority <span className="text-destructive">*</span></Label>
                            <Select value={taskForm.priority} onValueChange={v => setTaskForm(f => ({ ...f, priority: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {priority.map((v) => (
                                        <SelectItem key={v} value={v}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Assignee <span className="text-destructive">*</span></Label>
                            <Select value={taskForm.assigneeId} onValueChange={v => setTaskForm(f => ({ ...f, assigneeId: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select Member" /></SelectTrigger>
                                <SelectContent>
                                    {/* <SelectItem value="none">Unassigned</SelectItem> */}
                                    {members.map((m, i) => (
                                        <SelectItem key={i} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Due Date <span className="text-destructive">*</span></Label>
                            <Input type="date" min={new Date().toISOString().split("T")[0]} value={taskForm.dueDate}
                                onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} />
                        </div>
                    </div>

                    <Button
                        type='submit'
                        // onClick={handleCreateTask}
                        disabled={loading}
                    >
                        {loading ? "Updating…" : "Update Task"}
                        {/* Create Task */}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default UpdateTaskForm