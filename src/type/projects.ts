export interface Member {
    id: string;
    name: string;
    role: string;
}

export interface Project {
    id: string;
    title: string;
    description: string|null;
    githubUrl: null | string;
    deadline: Date;
    status: string;
    progressCount: number;
    createdAt: Date;
    updatedAt: Date;
    members: Member[];
    totalTasks?: number;
    tasks:{status:string}[];
    completedTasks?: number;
    projectColor:string|null;
}


export interface ProjectPayload {
    title: string;
    deadline: string|Date;
    description?: string;
    status: string;
    members: { id: string }[];
    githubUrl?: string;
    projectColor?: string;
}