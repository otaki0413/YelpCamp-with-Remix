import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Rating } from "@smastrom/react-rating";
import { MessageCircleMore } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getHotSprings } from "~/models/hotspring.server";
import { getRatingAvg } from "~/models/review.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const hotSprings = await getHotSprings();
  const hotSpringsWithAvg = await Promise.all(
    hotSprings.map(async (hotSpring) => {
      const ratingAvg = await getRatingAvg(hotSpring.id);
      return {
        ...hotSpring,
        ratingAvg,
      };
    }),
  );

  return json({ hotSprings: hotSpringsWithAvg });
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
        {hotSprings.map(
          ({ id, title, location, images, ratingAvg, _count }) => (
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
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Rating
                          style={{ maxWidth: "90px" }}
                          readOnly
                          value={ratingAvg}
                        />
                        <div className="font-bold">{ratingAvg}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircleMore strokeWidth={1.5} />
                        <div className="text-sm">{_count.reviews}</div>
                        <span className="text-sm">コメント</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="flex w-1/2 items-center justify-center p-4">
                  <img
                    src={
                      images[0]?.url ||
                      "https://source.unsplash.com/body-of-water-on-near-rocks-UHcwyq05_Gk"
                    }
                    className="h-40 w-60 rounded-sm object-fill"
                    alt="温泉の画像"
                  ></img>
                </div>
              </Card>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
