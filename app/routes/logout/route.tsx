import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: "/" });
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
