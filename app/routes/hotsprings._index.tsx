import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const TEST_ITEMS = [
  {
    id: "a",
    title: "温泉A",
    description: "素敵な温泉でした",
    price: "500",
    location: "石川県金沢市",
    url: "test.com",
  },
  {
    id: "b",
    title: "温泉B",
    description: "素敵な温泉でした",
    price: "1000",
    location: "石川県野々市市",
    url: "test.com",
  },
  {
    id: "c",
    title: "めっちゃキレイな温泉",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "https://source.unsplash.com/body-of-water-on-near-rocks-UHcwyq05_Gk",
  },
  {
    id: "d",
    title: "温泉Dたのしい楽しい楽しい楽しい楽しい楽しい楽しい楽しい楽しい",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "e",
    title: "草津温泉",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "f",
    title: "温泉F",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "f",
    title: "温泉F",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "f",
    title: "温泉Faaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "f",
    title: "温泉F",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const allItems = TEST_ITEMS;
  return allItems;
};

export default function HotSpringsIndexRoute() {
  const allHotsprings = useLoaderData<typeof loader>();

  return (
    <div className="w-full px-8 py-8 sm:px-20">
      <div className="pb-4 text-center text-2xl font-bold">温泉リスト</div>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="outline">
          <Link to="new">新規登録へ</Link>
        </Button>
      </div>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {allHotsprings.map(({ id, title, location, url }) => (
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
