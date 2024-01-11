import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

export default function HotSpringsRoute() {
  return (
    <div className="w-full bg-red-200 p-4">
      <Outlet />
    </div>
  );
}
