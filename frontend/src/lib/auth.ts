/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from 'jose';


export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  try {
    const { payload } = await jwtVerify(token, secret);
    // console.log(payload);
    return payload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: any) {
    return null;
  }
}

