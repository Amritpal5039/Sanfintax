import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// export default function verifyAuth(request:NextRequest){
// try{
//   const authHeader= request.headers.get("authorization");
//   if (!authHeader){
//     return{ success:false,error:"Unauthorized"};
   
//   }
//   if(!authHeader.startsWith("Bearer ")){
//     return{
//       success:false,
//       error:"header not found"
//   };
//   } 
//   const token = authHeader.split(" ")[1];
//   if(!token){
//     return{
//       success:false,
//       error:"token not found"
//   };
//   }
//   const JWT_SECRET = process.env.JWT_SECRET;
//   if (!JWT_SECRET) {
//     throw new Error("JWT secret is not defined");
//   }
//   const decoded = jwt.verify(token, JWT_SECRET);
//   return {
//     sucess:true,
//     User:decoded,
//   };
// } catch (error:any){
//   console.error("Authentication error:", error);
//   return NextResponse.json(
//     { message: "Unauthorized", error: error.message },
//     { status: 401 },
//   );
// }
// }