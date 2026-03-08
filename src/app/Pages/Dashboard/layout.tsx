import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

type JwtPayload = {
  email?: string;
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/Pages/Login");
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    redirect("/Pages/Login");
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify<JwtPayload>(token, secret);

    if (!payload.email) {
      redirect("/Pages/Login");
    }
  } catch {
    redirect("/Pages/Login");
  }

  return <>{children}</>;
}
