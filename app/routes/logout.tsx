import { authenticator } from "~/services/auth.server";
import type { Route } from ".react-router/types/app/routes/+types/logout";

export const action = async ({ request }: Route.ActionArgs) => {
  return await authenticator.logout(request, { redirectTo: "/login" });
};
