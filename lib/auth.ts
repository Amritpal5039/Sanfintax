import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export default async function getUserFromToken() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) {
            throw new Error("Unauthorized");
        }
        
        const payload = await verifyToken(token);
        if (!payload) {
            throw new Error("Invalid token");
        }
        
        return payload;
    } catch (error) {
        console.error("User authentication failed:", error);
        return null;
    }
}
//userId
//email