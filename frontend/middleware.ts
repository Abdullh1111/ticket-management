import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TRole } from "@/types/role.interface";
import { verifyToken } from "@/lib/auth";

// Define protected routes and their required roles
// const PROTECTED_ROUTES = {
//   '/profile': [userStatus.USER, userStatus.ADMIN],
//   '/game': [userStatus.USER, userStatus.ADMIN],
//   '/admin': [userStatus.ADMIN],
//   '/api/admin': [userStatus.ADMIN],
// } as const;

const userStatus = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard": [userStatus.USER, userStatus.ADMIN],
  "/admin": [userStatus.ADMIN],
};

export type JwtPayload = {
  id: string;
  email: string;
  role: TRole; // Adjust based on your system's roles
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
};

export async function middleware(request: NextRequest) {
  console.log("hello there")
  const { pathname } = request.nextUrl;
  console.log("pathname", pathname);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Check if the path is protected
  const protectedPath = Object.keys(PROTECTED_ROUTES).find((path) =>
    pathname.startsWith(path)
  );

  if (protectedPath) {
    const token = request.cookies.get("accessToken")?.value;


    // Handle missing
    console.log("token", token);
    if (!token) {
      if (request.headers.get("accept")?.includes("application/json")) {
        return NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    // Verify token and check user role
    const user = await verifyToken(token) as JwtPayload | null;
    if (!user) {
      if (request.headers.get("accept")?.includes("application/json")) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    console.log(user);
    // Check if user has required role for the path
    const requiredRoles =
      PROTECTED_ROUTES[protectedPath as keyof typeof PROTECTED_ROUTES];
    if (!requiredRoles.includes(user.role)) {
      if (request.headers.get("accept")?.includes("application/json")) {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 403 }
        );
      } 
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-role", user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard/:path*", "/admin/:path*"],
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
