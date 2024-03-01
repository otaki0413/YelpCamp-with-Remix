import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { redirectWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  CreateHotSpringSchema,
  getHotSpring,
  updateHotSpring,
} from "~/models/hotspring.server";
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  const formDataObj = Object.fromEntries(await request.formData());

  const validationResult = CreateHotSpringSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    return json({
      validationErrors: validationResult.error.flatten().fieldErrors,
    });
  }

  const updatedHotSpring = await updateHotSpring({
    ...validationResult.data,
    id: hotSpringId,
  });

  return redirectWithSuccess(
    `/hotsprings/${hotSpringId}`,
    `${updatedHotSpring.title}を更新しました！✨`,
  );
};

export default function EditRoute() {
  const { hotSpring } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const validationMessages = actionData?.validationErrors;

  return (
    <div className="mx-auto w-full max-w-2xl px-8 py-8 sm:px-20">
      <div className="pb-4 text-center text-2xl font-bold">編集</div>
      <div>
        <Form method="POST">
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
              defaultValue={hotSpring.title}
              required
            />
            {validationMessages?.title && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages?.title[0]}
              </p>
            )}
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
              defaultValue={hotSpring.location}
              required
            />
            {validationMessages?.location && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages?.location[0]}
              </p>
            )}
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
              defaultValue={hotSpring.price}
              required
            />
            {validationMessages?.price && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages?.price[0]}
              </p>
            )}
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
              defaultValue={hotSpring.description}
              required
            />
            {validationMessages?.description && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages?.description[0]}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              画像
            </Label>
            <Input type="file" id="image" name="image" />
          </div>

          <div>
            <Label
              htmlFor="uploadedImage"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              アップロード済み画像
            </Label>
            <div className="flex gap-x-2">
              {hotSpring.images.map((image) => {
                return (
                  <div key={image.id}>
                    <img
                      src={image.url}
                      alt={`温泉の写真${image.id}`}
                      className="size-32 rounded-md border border-muted object-cover"
                    />
                    <div className="flex items-center gap-x-1">
                      <input
                        type="checkbox"
                        name="deleteImages[]"
                        id={`image${image.id}`}
                        value={image.publicId}
                      />
                      <Label htmlFor={`image${image.id}`} className="text-sm">
                        削除する
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full">
              更新する
            </Button>
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
