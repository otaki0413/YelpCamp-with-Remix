import { redirect } from "react-router";
import { destroySession, getSession } from "~/services/session.server";
import type { Route } from ".react-router/types/app/routes/+types/logout";

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};
