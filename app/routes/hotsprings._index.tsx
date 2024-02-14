import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getHotSprings } from "~/models/hotspring.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hotSprings = await getHotSprings();
  return json({ hotSprings });
};

export default function HotSpringsIndexRoute() {
  const { hotSprings } = useLoaderData<typeof loader>();

  return (
    <div className="w-full px-8 py-8 sm:px-20">
      <div className="pb-4 text-center text-2xl font-bold">温泉リスト</div>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="outline">
          <Link to="new">新規登録へ</Link>
        </Button>
      </div>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {hotSprings.map(({ id, title, location }) => (
          <Link key={id} to={`${id}`}>
            <Card className="flex w-full">
              <div className="w-1/2">
                <CardHeader>
                  <CardTitle className="line-clamp-2 break-all">
                    {title}
                  </CardTitle>
                  <CardDescription>{location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>TODO:レビューのスター数</div>
                </CardContent>
              </div>
              <div className="flex w-1/2 items-center justify-center p-4">
                <img
                  src="https://source.unsplash.com/body-of-water-on-near-rocks-UHcwyq05_Gk"
                  className="h-40 w-40 rounded-sm object-cover"
                  alt="温泉の画像"
                ></img>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
