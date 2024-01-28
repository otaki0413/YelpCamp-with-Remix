import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { authenticator } from "~/services/auth.server";

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
  const hotspring = useLoaderData<typeof loader>();
  return (
    <div className="w-full p-8">
      <div className="mx-auto flex w-[1000px] flex-col sm:flex-row">
        <Card>
          <ScrollArea>
            <div className="flex gap-x-4 px-4">
              {IMAGES.map((image) => {
                return <img key={image.id} src={image.src} alt="温泉画像" />;
              })}
            </div>
            <ScrollBar orientation="horizontal" className="h-0" />
          </ScrollArea>
          <CardHeader>
            <div className="text-3xl font-bold">{hotspring.title}</div>
            <CardDescription>群馬県</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              草津温泉は、日本の群馬県に位置する歴史ある温泉地で、標高1,200メートルに広がります。その源泉は日本一の湧出量を誇り、湯畑と呼ばれる地域では温泉が地表に湧き出ている光景が見られます。硫黄泉で知られ、美肌やリラックス効果が期待できることから、多くの観光客が訪れます。四季折々の風景や歴史的な建造物も魅力で、観光と温泉療法を楽しむことができます。
            </div>
          </CardContent>
        </Card>
        <div className="flex w-1/3 flex-col">
          <div className="flex size-96 items-center justify-center bg-red-100">
            地図
          </div>
          <div>レビュー一覧</div>
        </div>
      </div>
    </div>
  );
}
