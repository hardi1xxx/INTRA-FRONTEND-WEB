import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const expiresAt = request.cookies.get("intra_auth_expires_at")?.value;

  // cek expired
  if (expiresAt && Date.now() > Number(expiresAt) * 1000) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("intra_auth_token");
    response.cookies.delete("intra_auth_name");
    response.cookies.delete("intra_auth_expires_at");
    response.cookies.delete("intra_auth_role");
    response.cookies.delete("intra_auth_nik");
    response.cookies.delete("intra_auth_picture");
    response.cookies.delete("intra_auth_menu_access");

    return response;
  }

  // redirect ke login kalau belum login
  if (
    request.nextUrl.pathname.startsWith("/") &&
    !request.nextUrl.pathname.includes("/login") &&
    !request.cookies.has("intra_auth_token")
  ) {
    const searchParams = new URLSearchParams();

    if (request.nextUrl.pathname.length > 1) {
      const host = request.headers.get("x-forwarded-host");
      const proto = request.headers.get("x-forwarded-proto");
      const origin = process.env.ORIGIN || `${proto}://${host}`;

      searchParams.append(
        "redirect",
        `${origin}${request.nextUrl.pathname}${request.nextUrl.search}`
      );
    }

    return NextResponse.redirect(
      new URL("/login?" + searchParams.toString(), request.url)
    );
  }

  // kalau sudah login dan ke root
  if (
    request.nextUrl.pathname === "/" &&
    request.cookies.has("intra_auth_token")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // validasi menu
  const menuListFlast = [
    "dashboard",
    "master/mitra",
    "master/batch",
    "master/status-project",
    "master/category-project",
    "master/regional",
    "master/area",
    "master/branch",
    "master/sto",
    "log/log-activity",
    "log/log-notification",
  ];

  if (
    !menuListFlast.find((value) =>
      request.nextUrl.pathname.includes(value)
    ) &&
    ![
      "/auth/change-password",
      "/dashboard",
      "/notfound",
      "/forbidden",
      "/login",
      "/profile",
      "/notifications",
    ].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/notfound", request.url));
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
};