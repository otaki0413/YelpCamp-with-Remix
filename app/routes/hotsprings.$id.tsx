import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
          <CardHeader>
            <CardTitle>{hotspring.title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur, molestias dolore voluptatum eaque possimus quas fugit
              quasi a dicta illum accusantium atque itaque id voluptatem
              nesciunt nam, cum officiis. Deleniti.
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
