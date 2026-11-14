export interface Message {
    id: string;
    image?: string | null;
    file?: string | null;
    message: string;
    createdAt: string;
    updatedAt: string;
    senderId?: string;
sender:{
        name: string,
        id: string,
        image?: string;
    };
    taskId: string;
}


export interface MessagePayload {
    message: string;
    file?: string;
    image?: string;
    taskId: string;
    senderId: string;
}