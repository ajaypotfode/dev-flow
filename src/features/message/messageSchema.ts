import { MessagePayload } from "@/src/type/message";
import { z } from "zod";

const messageSchema = z.object({
    message: z
        .string({ error: "message is required" }),
    senderId: z
        .string({ error: "SenderId is required" }),

    taskId: z
        .string({ error: "TaskId is required" }),
    image: z
        .string()
        .optional(),
    file: z
        .string()
        .optional(),
});

export const messageValidation = (data: MessagePayload) => {
    const validation = messageSchema.safeParse(data);

    return { success: validation.success, message: validation.error?.issues[0].message }
}