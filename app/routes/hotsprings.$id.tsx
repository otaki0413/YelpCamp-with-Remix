import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Rating } from "@smastrom/react-rating";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { authenticator } from "~/services/auth.server";

const TEST_ITEMS = [
  {
    id: "a",
    title: "草津温泉",
    description:
      "草津温泉は、日本の群馬県に位置する歴史ある温泉地で、標高1,200メートルに広がります。その源泉は日本一の湧出量を誇り、湯畑と呼ばれる地域では温泉が地表に湧き出ている光景が見られます。硫黄泉で知られ、美肌やリラックス効果が期待できることから、多くの観光客が訪れます。四季折々の風景や歴史的な建造物も魅力で、観光と温泉療法を楽しむことができます。",
    price: "13990",
    location: "群馬県吾妻郡草津町草津",
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
    id: "g",
    title: "温泉F",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "h",
    title: "温泉Faaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
  {
    id: "i",
    title: "温泉F",
    description: "素敵な温泉でした",
    price: "1200",
    location: "石川県七尾市",
    url: "test.com",
  },
];

export const IMAGES = [
  {
    id: 1,
    src: "https://source.unsplash.com/body-of-water-on-near-rocks-UHcwyq05_Gk",
  },
  {
    id: 2,
    src: "https://source.unsplash.com/body-of-water-on-near-rocks-UHcwyq05_Gk",
  },
  {
    id: 3,
    src: "https://source.unsplash.com/body-of-water-on-near-rocks-UHcwyq05_Gk",
  },
];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const id = params.id;
  const hostpring = TEST_ITEMS.find((value) => value.id === id);
  return hostpring;
};

export default function HotSpringRoute() {
  const [rating, setRating] = useState(0);
  const { title, description, location, price } =
    useLoaderData<typeof loader>();

  return (
    <div className="w-full p-4">
      <div className="flex max-w-[1200px] flex-col gap-4 md:mx-auto md:flex-row">
        <div className="md:w-3/5">
          <Card>
            <ScrollArea>
              <div className="flex gap-x-4 px-4 pt-4">
                {IMAGES.map((image) => {
                  return (
                    <img
                      key={image.id}
                      src={image.src}
                      alt="温泉画像"
                      className="rounded-md"
                    />
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-0" />
            </ScrollArea>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{title}</CardTitle>
              <CardDescription>{location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{description}</p>
              <Separator className="my-2" />
              <div className="flex items-center gap-2">
                <div>
                  料金: <span>{price}円/泊</span>
                </div>
              </div>
              <Separator className="my-2" />
              <div>
                {/* TODO Userテーブルとの紐づけ必要あり */}
                登録者: <span>otaki</span>
              </div>
              <Separator className="my-2" />
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                最終更新日： yyyy年mm月dd日
              </div>
              <div className="flex gap-2">
                <Link to="edit">
                  <Button variant="outline">編集</Button>
                </Link>
                <Button variant="destructive">削除</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full md:w-2/5">
          {/* <div className="size-72 w-full bg-red-100 text-center">
            TODO: 地図をここに表示(Leaflet使う予定)
          </div> */}
          <div>
            <div className="p-4 text-center text-xl font-bold underline">
              レビューコメント
            </div>
            {/* レビュー投稿用フォーム */}
            <div className="pb-8">
              <Form className="space-y-2">
                <Rating
                  style={{ maxWidth: 180 }}
                  value={rating}
                  onChange={setRating}
                  isRequired
                />
                <Textarea
                  id="comment"
                  name="comment"
                  required
                  className="border border-gray-300"
                />
                <div className="flex justify-end">
                  <Button>投稿する</Button>
                </div>
              </Form>
            </div>
            {/* レビュー表示エリア */}
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  return (
                    <div
                      key={num}
                      className="rounded-md border border-gray-300 p-2 shadow-none"
                    >
                      <div className="">テスト{num}さん</div>
                      <Rating style={{ maxWidth: 100 }} value={3} readOnly />
                      <p className="line-clamp-2 break-all">
                        とてもいい温泉でした。また行ってみたいです！とてもいい温泉でした。また行ってみたいです！とてもいい温泉でした。また行ってみたいです！
                      </p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
