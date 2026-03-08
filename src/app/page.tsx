"use client"
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1>Sanfintax</h1>
      <button onClick={()=>router.push("/Pages/Login")}>Login</button>
    </div>
  );
}
