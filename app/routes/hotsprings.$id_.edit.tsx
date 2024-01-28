import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const id = params.id;
  return id;
};

export default function EditRoute() {
  const id = useLoaderData<typeof loader>();

  return <div className="bg-green-200">温泉の編集画面: idは{id}</div>;
}
