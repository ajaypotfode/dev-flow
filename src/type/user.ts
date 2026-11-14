export interface User {
    name: string
    email: string
    // password: string
    role: string
    image: string|null;
    status: string
}

export interface UserPayload {
    name: string
    email: string
    role: string
    phone?:string;
    image?: string
    status: string
    password?:string;
    id?:string;
}

export interface Progress {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    completionRate: number;
}

export interface Team {
    id: string;
    name: string;
    email: string;
    // password: string;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    progress: Progress;
}