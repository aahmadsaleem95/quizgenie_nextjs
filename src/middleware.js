import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/register"];
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("user")?.value;

  // Allow access to public routes without token
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if no token on protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = await verifyToken(token);
    request.headers.set("x-user-id", decoded.id);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// ✅ Updated matcher to exclude /api and static files
export const config = {
  matcher: [
    // Only apply to these paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
