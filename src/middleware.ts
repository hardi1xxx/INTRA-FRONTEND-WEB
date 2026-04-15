import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (Date.now() > Number(request.cookies.get("intra_auth_expires_at")?.value) * 1000) {
    request.cookies.delete("intra_auth_token");
    request.cookies.delete("intra_auth_name");
    request.cookies.delete("intra_auth_expires_at");
    request.cookies.delete("intra_auth_role");
    request.cookies.delete("intra_auth_is_app");
    request.cookies.delete("intra_auth_is_web");
    request.cookies.delete("intra_auth_departement_id");
    request.cookies.delete("intra_auth_nik");
    request.cookies.delete("intra_auth_picture");
    request.cookies.delete("intra_auth_menu_access");
  }
  if (request.nextUrl.pathname.startsWith("/") && !request.nextUrl.pathname.includes("/login") && !request.cookies.has("intra_auth_token")) {
    const searchParams = new URLSearchParams();
    if (request.nextUrl.pathname.length > 1) {
      const host = request.headers.get("x-forwarded-host");
      const proto = request.headers.get("x-forwarded-proto");
      const origin = process.env.ORIGIN || `${proto}://${host}`;

      searchParams.append("redirect", `${origin}${request.nextUrl.pathname}${request.nextUrl.search}`);
    }

    return NextResponse.redirect(new URL("/login?" + searchParams.toString(), request.url));
  }

  if (request.nextUrl.pathname == "/" || (request.nextUrl.pathname.includes("/login") && request.cookies.has("intra_auth_token"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const menuListFlast = [
    "dashboard",

    // master
    "master/status-lapangan",
    "master/witel",

    // transaction
    "transaction/daily-man-power",

    // report
    "report/pt3",

    // setting
    "setting/role-user",
    "setting/menu-access-mobile",
    "setting/user",
    "setting/job-position",
    "setting/latest-feature",
    "setting/department-user",
    "log/log-activity",
    "log/log-notification",
  ];

  if (
    !menuListFlast.find((value) => request.nextUrl.pathname.includes(value)) &&
    !["/auth/change-password", "/dashboard", "/notfound", "/forbidden", "/login", "/profile", "/notifications"].find((value) => request.nextUrl.pathname == value)
  ) {
    return NextResponse.redirect(new URL("/notfound", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
};
