import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, json, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { getHotSpring } from "~/models/hotspring.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  const hotSpring = await getHotSpring(hotSpringId);
  if (!hotSpring) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ hotSpring });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export default function EditRoute() {
  const { hotSpring } = useLoaderData<typeof loader>();

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
            <Input
              type="text"
              id="title"
              name="title"
              value={hotSpring.title}
              required
            />
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
              value={hotSpring.location}
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
              value={hotSpring.price}
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
              value={hotSpring.description}
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
          <Link
            to={`/hotsprings/${hotSpring.id}`}
            className="pl-0 text-blue-500"
          >
            戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
