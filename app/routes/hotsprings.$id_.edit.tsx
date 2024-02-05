import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
    title: "草津温泉",
    description:
      "草津温泉は、日本の群馬県に位置する歴史ある温泉地で、標高1,200メートルに広がります。その源泉は日本一の湧出量を誇り、湯畑と呼ばれる地域では温泉が地表に湧き出ている光景が見られます。硫黄泉で知られ、美肌やリラックス効果が期待できることから、多くの観光客が訪れます。四季折々の風景や歴史的な建造物も魅力で、観光と温泉療法を楽しむことができます。",
    price: "13990",
    location: "群馬県吾妻郡草津町草津",
    url: "test.com",
  },
  {
    id: "c",
    title: "草津温泉",
    description:
      "草津温泉は、日本の群馬県に位置する歴史ある温泉地で、標高1,200メートルに広がります。その源泉は日本一の湧出量を誇り、湯畑と呼ばれる地域では温泉が地表に湧き出ている光景が見られます。硫黄泉で知られ、美肌やリラックス効果が期待できることから、多くの観光客が訪れます。四季折々の風景や歴史的な建造物も魅力で、観光と温泉療法を楽しむことができます。",
    price: "13990",
    location: "群馬県吾妻郡草津町草津",
    url: "test.com",
  },
  {
    id: "d",
    title: "草津温泉",
    description:
      "草津温泉は、日本の群馬県に位置する歴史ある温泉地で、標高1,200メートルに広がります。その源泉は日本一の湧出量を誇り、湯畑と呼ばれる地域では温泉が地表に湧き出ている光景が見られます。硫黄泉で知られ、美肌やリラックス効果が期待できることから、多くの観光客が訪れます。四季折々の風景や歴史的な建造物も魅力で、観光と温泉療法を楽しむことができます。",
    price: "13990",
    location: "群馬県吾妻郡草津町草津",
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

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export default function EditRoute() {
  const { id, title, location, price, description } =
    useLoaderData<typeof loader>();

  return (
    <div className="mx-auto w-full max-w-2xl px-8 py-8 sm:px-20">
      <div className="pb-4 text-center text-2xl font-bold">編集</div>
      <div>
        <Form>
          <div className="mb-4">
            <Label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              タイトル
            </Label>
            <Input type="text" id="title" name="title" value={title} required />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              場所
            </Label>
            <Input
              type="location"
              id="location"
              name="location"
              value={location}
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              価格
            </Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={price}
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              説明
            </Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              画像
            </Label>
            <Input type="file" id="image" name="image" required />
          </div>
          <div className="mt-8">
            <Button className="w-full">更新する</Button>
          </div>
        </Form>
      </div>
      <div className="mt-8">
        <Button variant="link" asChild>
          <Link to={`/hotsprings/${id}`} className="pl-0 text-blue-500">
            戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
