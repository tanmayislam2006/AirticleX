import { cookies } from "next/headers";
const AUTH_URL = "http://localhost:5000/api/auth";

export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: string;
  emailVerified?: boolean;
}

export interface SessionPayload {
  user: SessionUser;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
  };
}

export const userService = {
  getSessionUser: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const session = (await res.json()) as SessionPayload | null;
      if (session === null) {
        return { data: null, error: { message: "Session Is Missing" } };
      }
      return { data: session, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
