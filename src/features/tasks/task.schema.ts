import { z } from "zod";

const taskSchema = z.object({
    task: z
        .string({ error: "Title is required" })
        .min(2, { message: "title should be at least 2 characters" }),
    description: z
        .string()
        .optional(),
    priority: z
        .enum(["urgent", "high", "low", "medium"],
            { message: "status should be 'urgent', 'high', 'low' or 'medium'" }),
    dueDate: z
       .coerce.date({ error: "due date Is Required" }),

    projectId: z
        .string({ error: "project is required" }),

    memberId: z
        .string({ error: "member is required" })
});

export const taskValidation = (data: any) => {
    const validation = taskSchema.safeParse(data);

    return { success: validation.success, message: validation.error?.issues[0].message }
}