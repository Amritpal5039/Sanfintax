import { NextResponse } from "next/server";

export async function POST() {

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    // old path {path: "/Pages/Dashboard"}, with this path token is not fully removed but now token is fully removed 
    path: "/"
  });

  return response;
}
