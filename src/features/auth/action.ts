"use server";

import { generateRefreshToken, generateToken } from "@/src/lib/session";
// import { loginUserSchema } from "@/src/lib/validation/user.schema";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginUserSchema } from "./login.schema";
import { loginService } from "@/src/services/auth";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/src/lib/require_session";

const GENERIC_ERROR = "Invalid email or password";

export interface LoginResult {
    error?: string;
    user?: { name: string, email: string }
}

export const loginAction = async (logindata: { email: string, password: string }): Promise<LoginResult> => {
    const parsed = loginUserSchema.safeParse(logindata);
    if (!parsed.success) {
        return { error: GENERIC_ERROR };
    }

    try {
        const user = await loginService(logindata.email)

        if (!user) {
            return { error: GENERIC_ERROR };
        };

        const password = await compare(logindata.password, user.password);

        if (!password) {
            return { error: GENERIC_ERROR };
        };

        const tokenObj={
             id: user.id,
              role: user.role,
               userName: user.name,
               email:user.email
        }

        const { token } = await generateToken(tokenObj);
        const { refresh_token } = await generateRefreshToken(tokenObj);

        const cookieStore = await cookies();
        cookieStore.set('devToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15,
            path: '/'
        });

        cookieStore.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        revalidatePath('/dashboard');
        return { user: { name: user.name, email: user.email } }
    } catch (error) {
        console.error(error);
        // console.log("error is : ", error);

        return { error: "Something Went Wrong" };
    }
}

export const logoutAction = async () => {
    const cookieStore = await cookies();

    cookieStore.delete('devToken');
    cookieStore.delete('refresh_token');

    redirect('/auth/login');
}


export const getCurrentUser = async () => {
    const session = await requireSession();

    // console.log("session :sjsl  :",session);
    

    return {
        name:session.userName,
        id:session.id, 
        role:session.role,
        email:session.email
    }

}

