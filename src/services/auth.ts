import prisma from "../lib/prisma"

export const loginService = async (email: string ) => {
    const loginData = await prisma.user.findUnique({
        where: { email: email }
    });

    return loginData;
}