import { createCookieSessionStorage } from "react-router";
import { User } from "@prisma/client";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRETを設定してください。");

export const SESSION_KEY = "user";
export const sessionStorage = createCookieSessionStorage<{
  [SESSION_KEY]: User;
}>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * Cookieからセッションデータと関連するユーザー情報を取得する
 */
export async function getSessionUser(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const sessionUser = session.get(SESSION_KEY);
  return sessionUser;
}
