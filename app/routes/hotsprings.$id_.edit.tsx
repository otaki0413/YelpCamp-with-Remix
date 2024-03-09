import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  UploadHandler,
} from "@remix-run/node";
import {
  unstable_parseMultipartFormData as parseMultipartFormData,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  HotSpringSchema,
  CreateHotSpringSchema,
  deleteHotSpringImages,
  getHotSpring,
  updateHotSpring,
} from "~/models/hotspring.server";
import { createImagesObject } from "~/routes/hotsprings.new";
import { authenticator } from "~/services/auth.server";
import {
  deleteImageById,
  uploadImageToCloudinary,
} from "~/utils/cloudinary.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  // TODO: 下記トースターが2回実行されるのはなぜか分からないので調査中
  if (user === null) {
    return redirectWithError("/login", "ログインが必要なルートです！🚧");
  }

  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  const hotSpring = await getHotSpring(hotSpringId);
  if (!hotSpring) {
    throw new Response("Not Found", { status: 404 });
  }

  if (user.id !== hotSpring.authorId) {
    return redirectWithError(
      `/hotSprings/${hotSpring.id}`,
      "あなたにこの温泉情報を編集できません！🚧",
    );
  }

  return json({ hotSpring });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (user === null) {
    return redirectWithError("/login", "ログインが必要な操作です！🚧");
  }

  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  // TODO: 後続の処理でrequestを使うためcloneしているが、別のやり方があれば変えたい
  const formData = await request.clone().formData();
  const formDataObj = Object.fromEntries(formData);
  let validationResult;
  validationResult = HotSpringSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    return json({
      validationErrors: validationResult.error.flatten().fieldErrors,
    });
  }

  const imageData = formData.get("image");
  // ファイルが空でない場合、parseMultipartFormDataで対応する
  if (imageData instanceof Blob && imageData.size > 0) {
    const imgIds: string[] = [];
    const uploadHandler: UploadHandler = composeUploadHandlers(
      async ({ name, data }) => {
        if (name !== "image") {
          return undefined;
        }
        const uploadedImage = await uploadImageToCloudinary(data);
        imgIds.push(uploadedImage.public_id);
        return uploadedImage.secure_url;
      },
      createMemoryUploadHandler(),
    );

    const multipartFormData = await parseMultipartFormData(
      request,
      uploadHandler,
    );
    const imgUrls = multipartFormData.getAll("image");
    const images = createImagesObject(imgUrls, imgIds);
    multipartFormData.delete("image");

    const formDataObj = {
      ...Object.fromEntries(multipartFormData),
      images,
    };

    validationResult = CreateHotSpringSchema.safeParse(formDataObj);
    if (!validationResult.success) {
      return json({
        validationErrors: validationResult.error.flatten().fieldErrors,
      });
    }
  }

  // アップロード画像関連の削除
  const deleteImgIds = formData.getAll("deleteImageId");
  if (deleteImgIds.length > 0) {
    // Cloudinaryから画像を削除する
    deleteImgIds.forEach((id) => deleteImageById(String(id)));
    // DBから画像レコードを削除する
    await deleteHotSpringImages(deleteImgIds.map((id) => id.toString()));
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
        <Form method="POST" encType="multipart/form-data">
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
            {validationMessages?.image && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.image[0]}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-600">
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
                        name="deleteImageId"
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
