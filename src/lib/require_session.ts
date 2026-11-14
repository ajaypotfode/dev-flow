// import { cookies } from "next/headers"
import { cookies } from "next/headers";
import { verifytoken } from "./session";
import { redirect } from "next/navigation";
// import { redirect } from "next/dist/server/api-utils";

// export const readToken = async () => {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('devToken')?.value;
//     return token ? await verifytoken() : null
// };

export const requireSession = async () => {
    const session = await verifytoken();

    if (!session) {
        redirect('/auth/login')
    }
    return session
}



// export const rolebasedAccess = async () => {
//     const session = await verifytoken();

//     if (!session) {
//         redirect('/auth/login');
//     };

//     if (session.role !== 'admin') {
//         redirect('/dashboard')
//     } else if (session.role !== 'leader') {
//         redirect('/dashboard')
//     }
// }

