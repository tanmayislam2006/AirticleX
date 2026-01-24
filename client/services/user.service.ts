import { cookies } from "next/headers";
const AUTH_URL = "http://localhost:5000/api/auth";
export const userService = {
  getSessionUser: async function () {
    try {
      const cookieStore = await cookies();
      console.log(cookieStore.toString());
      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const session = await res.json();
      if (session === null) {
        return { data: null, error: { message: "Session Is Missing" } };
      }
      return { data: session, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
