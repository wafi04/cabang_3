// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
const branchID = process.env.BRANCH_ID!;

const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
const adminRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if current route is admin
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. No token - redirect to login unless on public route
  if (!authToken) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Has token - verify it
  try {
    const { payload } = await jwtVerify(authToken, secretKey);
    const roleID = payload.roleID as number;
    const userBranchID = payload.branchID as number;
    const envBranchID = parseInt(branchID);

    // 3. If already logged in and trying to access login page, redirect to home
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 4. Check if user's branch matches environment branch (for protected routes)
    if (!isPublicRoute && userBranchID !== envBranchID) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    // 5. Check admin access
    if (isAdminRoute && roleID !== 2) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token - clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};