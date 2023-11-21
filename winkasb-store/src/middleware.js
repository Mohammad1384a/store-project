import { NextResponse } from "next/server";

export async function middleware(request) {
  const cookie = request?.cookies?.get("user")?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  const userInfo = {
    _id: JSON.parse(cookie)?._id || "",
    token: JSON.parse(cookie)?.token || "",
  };
  if (!(userInfo?.token?.length > 0) || !(userInfo?._id?.length > 0)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  try {
    const data = await fetch(`http://localhost:5000/user/${userInfo?._id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    });
    const { user } = await data.json();
    const path = request.url?.split("/")?.[3];
    if (path === "profile" && user) return;
    const inclusion = user.roles?.includes(path.toUpperCase());
    return NextResponse.rewrite(
      new URL(inclusion ? `/${path}` : "/auth", request.url)
    );
  } catch (error) {
    return NextResponse.rewrite(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile",
    "/blogger/:path*",
    "/teacher/:path*",
    "/vendor/:path*",
  ],
};
