import { User, UserPayload } from "@/src/type/user";
import z from "zod";

export const createUserSchema = z.object({
    name: z
        .string({ error: 'Name is required' })
        .min(2, {
            message: 'Name should be at least 2 characters',
        }),

    phone: z
        .string()
        .min(1, { message: "Phone Number is required" })
        .length(10, { message: "Phone should be exactly 10 digits" })
        .regex(/^[0-9]+$/, {
            message: "Phone should contain only digits",
        }),

    email: z
        .string({ error: 'Email is required', })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            {
                message: 'Invalid email address',
            }
        ),

    // password: z
    //     .string({ error: 'Password is required', })
    //     .regex(
    //         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //         {
    //             message:
    //                 'Password must contain at least one letter, one number, one special character and minimum 8 characters',
    //         }
    //     ),

    status: z.enum(
        ['active', 'blocked'],
        {
            message:
                "Status must be 'active', 'blocked'",
        }
    ),

    role: z.enum(
        ['admin', 'member', 'leader'],
        {
            message:
                "Role must be 'admin', 'member', or 'leader'",
        }
    ),

    image: z.string().optional(),
});

export const userValidation = (data: UserPayload) => {
    const validation = createUserSchema.safeParse(data);

    return { success: validation.success, message: validation.error?.issues[0].message }
}
