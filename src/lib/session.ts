import { JWTPayload, SignJWT, decodeJwt, jwtDecrypt, jwtVerify } from 'jose'
import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { string } from 'zod';


interface TokenPayload extends JWTPayload {
    id: string;
    role: string;
    userName: string;
    email: string;
}

const secretKey = new TextEncoder().encode(process.env.JWT_SECRETE);
const refresh_secretKey = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRETE);

export const generateToken = async (user: TokenPayload): Promise<{ token: string }> => {
    const maxAge = 60 * 15
    // const secretKey = process.env.JWT_SECRETE!;
    const token = await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
        .sign(secretKey);
    return { token }
    // return jwt.sign(user, JWT_SECRETE, { expiresIn: '15m' })
};


export const generateRefreshToken = async (user: TokenPayload): Promise<{ refresh_token: string }> => {
    const maxAge = 60 * 60 * 24 * 7
    // const secretKey = process.env.JWT_SECRETE!;
    const token = await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
        .sign(refresh_secretKey);
    return { refresh_token: token }
}


export const verifytoken = async () => {
    const cookieStore = await cookies();

    const token = cookieStore.get('devToken')?.value;

    if (!token) {
        return null
    }

    try {
        const { payload } = await jwtVerify<TokenPayload>(token, secretKey, {
            algorithms: ["HS256"],
            requiredClaims: ["exp"],
        });


        return {
            id: payload.id,
            role: payload.role,
            userName: payload.userName,
            email: payload.email
        };
    } catch {
        return null
    }
}


export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('devToken')?.value;

    if (token) {
        const payload = decodeJwt(token);
        return {
            userId: payload.id as string,
            token
        }
    }

    return {
        token: null
    }

    // return token;
}

// export const refreshSession = async () => {
//     const cookieStore = await cookies();

//     const refreshToken = cookieStore.get('refresh_token')?.value;

//     if (!refreshToken) {
//         redirect('/auth/login')
//     }

//     try {
//         const { payload } = await jwtVerify(refreshToken, refresh_secretKey, {
//             algorithms: ["HS256"],
//             requiredClaims: ["exp"],
//         });
//         // if (typeof payload.userId !== "string") {
//         //     return null;
//         // }

//         if (
//             typeof payload.id !== "string" ||
//             typeof payload.role !== "string"
//         ) {
//             redirect("/auth/login");
//         }

//         const { token } = await generateToken({ id: payload.id, role: payload.role })

//         cookieStore.set('devToken', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             maxAge: 60 * 15,
//             path: '/'
//         });
//         return { id: payload.id, role: payload.role };
//     } catch {
//         redirect('/auth/login')
//     }

// }
