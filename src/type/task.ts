import { LucideIcon } from "lucide-react";
// import { Task } from "../prisma/generated/client";

export interface TaskPayload{
    task: string;
    description: string;
    status: string;
    priority: string;
    projectId: string;
    memberId: string;
    dueDate: Date
}

type PriorityObj = {
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
};


export interface Task {
    id: string;
    task: string;
    description: string|null;
    priority: 'low'|'medium'|'high'|string;
    status: string;
    dueDate: Date;
    projectId: string;
    memberId: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt: null | Date;
    member: {
        id: string;
        name: string;
        // email: string;
        role: string;
        // image:string|null;
    };
    project: {
        id: string;
        title: string;
        githubUrl?: string | null;
    }
}

export interface PriorityConfigType { [key: string]: PriorityObj }
