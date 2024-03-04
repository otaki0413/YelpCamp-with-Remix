import type {
  UploadHandler,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  unstable_parseMultipartFormData as parseMultipartFormData,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from "@remix-run/node";
import { Form, Link, json, useActionData } from "@remix-run/react";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  CreateHotSpringSchema,
  createHotSpring,
} from "~/models/hotspring.server";
import { authenticator } from "~/services/auth.server";
import { uploadImageToCloudinary } from "~/utils/cloudinary.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (user === null) {
    return redirectWithError("/login", "ログインが必要なルートです！🚧");
  }
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (user === null) {
    return redirectWithError("/login", "ログインが必要な操作です！🚧");
  }
  // TODO: 現状Cloudinaryのpublic_idを適切に取得する方法がわからないので、暫定対処として配列に格納する
  const imgIds: string[] = [];

  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "image") {
        return undefined;
      }
      const uploadedImage = await uploadImageToCloudinary(data); // data: 画像のバイナリデータ
      imgIds.push(uploadedImage.public_id);
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler(),
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgUrls = formData.getAll("image");
  const images = createImagesObject(imgUrls, imgIds);
  formData.delete("image");

  const formDataObj = { ...Object.fromEntries(formData), images };

  const validationResult = CreateHotSpringSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    return json({
      validationErrors: validationResult.error.flatten().fieldErrors,
    });
  }

  const newHotSpring = await createHotSpring({
    ...validationResult.data,
    authorId: user.id,
  });

  // TODO: 第3引数にいれるべきかが分からないため調査する
  return redirectWithSuccess(
    `/hotsprings`,
    `${newHotSpring.title}を登録しました！🎉`,
  );
};

export default function CreateRoute() {
  const actionData = useActionData<typeof action>();
  const validationMessages = actionData?.validationErrors;

  return (
    <div className="mx-auto w-full max-w-2xl px-8 py-8 sm:px-20">
      <div className="pb-4 text-center text-2xl font-bold">温泉の新規登録</div>
      <div>
        <Form method="POST" encType="multipart/form-data">
          <div className="mb-4">
            <Label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              タイトル
            </Label>
            <Input type="text" id="title" name="title" required />
            {validationMessages?.title && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.title[0]}
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
            <Input type="location" id="location" name="location" required />
            {validationMessages?.location && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.location[0]}
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
            <Input type="number" id="price" name="price" required />
            {validationMessages?.price && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.price[0]}
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
            <Textarea id="description" name="description" required />
            {validationMessages?.description && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.description[0]}
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
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              multiple
            />
            {validationMessages?.images && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.images[0]}
              </p>
            )}
          </div>
          <div className="mt-8">
            <Button className="w-full">登録する</Button>
          </div>
        </Form>
      </div>
      <div className="mt-8">
        <Button variant="link" asChild>
          <Link to="/hotsprings" className="pl-0 text-blue-500">
            戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}

// TODO: この関数は新規登録と更新時に遣うので、別ファイルで持ったほうがいいかも？
// DBに保存する画像関連のオブジェクト作成
export function createImagesObject(urls: FormDataEntryValue[], ids: string[]) {
  return urls.map((url, index) => {
    return {
      url,
      publicId: ids[index],
    };
  });
}
