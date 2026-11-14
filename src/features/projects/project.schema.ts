import { z } from "zod";

const projetSchema = z.object({
    id: z
        .string()
        .optional(),
    title: z
        .string({ error: "Title is required" })
        .min(2, { message: "title should be at least 2 characters" }),
    description: z
        .string()
        .optional(),
    githubUrl: z
        .string()
        .optional(),
    deadline: z//.coercec convert "2026-05-12" into date object
        .coerce.date({ error: "deadline is required" }),
    status: z.
        enum(
            ["active", "pending", "complete"],
            { message: "status should be 'active','pending'or'complete'" }),
    // progressCount: z
    //     .number({ error: "progress count Should Number" }),
    members: z
        .array(z.object(), { error: "members are Required" })
        .min(1, "At least one member is required")
})

export const projectValidation = (data: any) => {
    const validation = projetSchema.safeParse(data);

    return { success: validation.success, message: validation.error?.issues[0].message }
}
