// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
// import { generateToken, getLoggedinUser } from './lib/jwtVerification'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { jwtVerify } from 'jose'
import { generateToken } from './lib/session'
// import { success } from 'zod';


// rate limiting to handle to many request
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 s'),
  analytics: true
});



const refreshSession = async (request: NextRequest): Promise<string | null> => {
  // console.log("refresh session function");

  const refresh_secretKey = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRETE);
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return null;
  };

  try {
    const { payload } = await jwtVerify(refreshToken, refresh_secretKey, {
      algorithms: ['HS256'],
      requiredClaims: ['exp']
    });

    // console.log("refresh session try block payload :", payload);
    if (
      typeof payload.id !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.userName !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    const { token } = await generateToken({
      id: payload.id,
      role: payload.role,
      userName: payload.userName,
      email: payload.email
    });

    // console.log("refresh session try block token:", payload);

    // request.cookies.set('devToken', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //     maxAge: 60 * 15,
    //     path: '/'
    // });
    // return { id: payload.id, role: payload.role };
    return token
  } catch {
    // console.log("refresh session catc block  :", error);
    return null;
  }
}


// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  const ip = process.env.NODE_ENV === 'development' ? '127.0.0.1' :
    (request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1');

  // this is use to get first Ip where in production request.headers.get('x-forwarded-for') return many ips
  const cleanIp = ip.split(',')[0].trim();

  const { success, /*limit, reset, remaining*/ } = await ratelimit?.limit(cleanIp);

  if (!success) {
    return new NextResponse('Too many requests!', {
      status: 429,
      // headers: {
      //   'X-RateLimit-Limit': limit.toString(),
      //   'X-RateLimit-Remaining': remaining.toString(),
      //   'X-RateLimit-Reset': reset.toString(),
      // },
    });
  }

  const response = NextResponse.next();
  const token = request.cookies.get('devToken')?.value;
  const { pathname } = request.nextUrl;
  console.log("pathname : ", pathname);


  if (!token) {
    // console.log("run refresh token ");
    const refresh_session = await refreshSession(request);
    // console.log("refresh Session :", refresh_session);

    if (!refresh_session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 15,
      path: '/'
    };

    response.cookies.set('devToken', refresh_session, cookieConfig);

    // this is use to inject new token in ongoing request
    request.cookies.set('devToken', refresh_session);

  }
  const authPaths = ['/auth/login', '/auth/signup'];

  console.log("pathname includes :", authPaths.includes(pathname));

  console.log("is true :", token && authPaths.includes(pathname));


  if (token && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;

}


export const config = {
  matcher: [
    "/",
    // client routes
    '/analytics',
    '/dashboard',
    '/projects',
    '/tasks',
    '/team',
    // '/api/dashboard',
    // '/api/auth/login',
    '/api/project/:path*',
    '/api/task/:path*',
    // '/api/auth/signup',
    '/api/team/:path*',
    // '/api/auth/logout',
    // '/api/auth/login'
    // '/api/auth/refres'
  ]
}