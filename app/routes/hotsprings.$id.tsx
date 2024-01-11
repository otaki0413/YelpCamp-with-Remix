import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const id = params.id;
  console.log(id);
  return id;
};

export default function HotSpringRoute() {
  const id = useLoaderData<typeof loader>();
  return <div className="bg-blue-200">温泉詳細画面: idは{id}</div>;
}
