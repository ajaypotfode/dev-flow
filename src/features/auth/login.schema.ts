import { User } from "@/src/type/user";
import { z } from "zod"


export const loginUserSchema = z.object({
    email: z
        .string({ error: 'Email is required', })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            {
                message: 'Invalid email address',
            }
        ),

    password: z
        .string({ error: 'Password is required', })
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            {
                message:
                    'Password must contain at least one letter, one number, one special character and minimum 8 characters',
            }
        ),

})


export const loginValidation = (data: { email: string, password: string }) => {
    const validation = loginUserSchema.safeParse(data);

    return { success: validation.success, message: validation.error?.issues[0].message }
}