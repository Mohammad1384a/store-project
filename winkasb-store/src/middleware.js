import { NextResponse } from "next/server";

export async function middleware(request) {
  const cookie = request?.cookies?.get("user")?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  const user = {
    _id: JSON.parse(cookie)?._id || "",
    token: JSON.parse(cookie)?.token || "",
  };
  if (!(user?.token?.length > 0) || !(user?._id?.length > 0)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  const data = await fetch(`http://localhost:5000/user/${user?._id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });
  await data
    .json()
    .then(({ user }) => {
      const inclusion = user.roles.includes("ADMIN");
      return NextResponse.redirect(
        new URL(inclusion ? "/admin" : "/auth", request.url)
      );
    })
    .catch((error) => {
      return Response.json(
        {
          success: false,
          message: error?.response?.data?.message ?? error?.message ?? error,
        },
        { status: error.status || 500 }
      );
    });
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
};
