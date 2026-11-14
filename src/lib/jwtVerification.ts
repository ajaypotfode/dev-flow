import jwt from 'jsonwebtoken'
// import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import * as jose from 'jose'

const JWT_SECRETE = process.env.JWT_SECRETE || ""

export const generateToken = (user: { id: string, role: string }) => {
    return jwt.sign(user, JWT_SECRETE, { expiresIn: '15m' })
};


export const generateRefreshToken = (
    user: { id: string; role: string }
) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            // userName:user.
        },
        process.env.REFRESH_TOKEN_SECRETE!,
        {
            expiresIn: "7d",
        }
    );
};

export const getLoggedinUser = async (request: NextRequest) => {
    // const cookie = await cookies();
    const token = request.cookies.get('devToken')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (checkAccessToken(token) && refreshToken) {
        try {
            const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })

            if (refreshRes.ok) {
                const JWT_ENCODED = new TextEncoder().encode(process.env.JWT_SECRETE)
                const data = await refreshRes.json()
                const { payload } = await jose.jwtVerify(data.token, JWT_ENCODED);

                return { user: { id: payload.id, role: payload.role }, accessToken: data.token }

            } else {
                // If refresh API fails (e.g. refresh token is revoked)
                return { user: null, accessToken: null }
            }
        } catch (error) {
            console.error("Refresh token API call failed:", error)
            return { user: null, accessToken: null }
        }
    }


    // If token is still valid, just read the user from it
    if (token) {

        const JWT_ENCODED = new TextEncoder().encode(process.env.JWT_SECRETE)
        try {
            const { payload } = await jose.jwtVerify(token, JWT_ENCODED)
            return { user: { id: payload.id, role: payload.role }, newAccessToken: null }
        } catch {
            return { user: null, newAccessToken: null }
        }
    }

    return { user: null, newAccessToken: null }

}

export const checkAccessToken = (token: string | undefined) => {

    if (!token) return true

    try {

        const decoded = jose.decodeJwt(token)

        if (!decoded.exp) return true

        // Time Comparison with a 10-second safety window:
        // Math.floor(Date.now() / 1000) converts current time from milliseconds to seconds.
        // (decoded.exp - 10) subtracts 10 seconds from the deadline to handle network lag.
        // Returns 'true' if the token is dead or about to die in the next 10 seconds.
        return Math.floor(Date.now() / 1000) >= (decoded.exp - 10);


    } catch (error) {
        return true
    }
}