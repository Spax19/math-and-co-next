// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth"; // Or './lib/auth' if that's where your verifyToken is

export async function middleware(request) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/profile", "/admin", "/web-admin"];
  const adminRoutes = ["/admin"];
  const webadminRoutes = ["/web-admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home if no token for protected
    }

    try {
      const decoded = await verifyToken(token); // Assuming verifyToken takes a token string and returns payload

      // *** ADD THIS CONSOLE.LOG ***
      console.log("Middleware: Path:", pathname);
      console.log("Middleware: Decoded Payload:", decoded);
      console.log("Middleware: Decoded Role:", decoded?.role); // Safely log the role

      if (!decoded) {
        throw new Error("Invalid token or token could not be decoded.");
      }

      // Check admin access
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isAdminRoute) {
        // Only enter this block if it's an admin route
        if (decoded.role !== "admin") {
          // Now check the role
          console.warn(
            `Unauthorized access: User role '${decoded.role}' for admin route '${pathname}'`
          );
          return NextResponse.redirect(
            new URL("/main/unauthorized", request.url)
          );
        }
      }

      // Check webadmin access
      const isWebadminRoute = webadminRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isWebadminRoute) {
        // Only enter this block if it's a web-admin route
        if (decoded.role !== "web-admin") {
          // Now check the role
          console.warn(
            `Unauthorized access: User role '${decoded.role}' for web-admin route '${pathname}'`
          );
          return NextResponse.redirect(
            new URL("/main/unauthorized", request.url)
          );
        }
      }

      // Add user info to headers
      const headers = new Headers(request.headers);
      headers.set("x-user-id", decoded.userId);
      headers.set("x-user-email", decoded.email);
      headers.set("x-user-role", decoded.role); // Ensure this matches what you expect client-side

      return NextResponse.next({
        request: { headers },
      });
    } catch (error) {
      console.error("Authentication error in middleware:", error);
      const response = NextResponse.redirect(new URL("/", request.url)); // Redirect to home
      response.cookies.delete("auth-token"); // Clear the invalid token
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*", // More general to cover all sub-paths
    "/web-admin/:path*", // More general to cover all sub-paths
  ],
};
