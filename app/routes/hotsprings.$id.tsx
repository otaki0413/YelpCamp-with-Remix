import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { useState } from "react";
import { Rating } from "@smastrom/react-rating";
import invariant from "tiny-invariant";
import { format } from "date-fns";
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
import { getHotSpring } from "~/models/hotspring.server";
import { getUserById } from "~/models/user.server";
import {
  CreateReviewSchema,
  createReview,
  getReviewsByHotSpringId,
} from "~/models/review.server";
import { jsonWithSuccess } from "remix-toast";

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
  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  const hotSpring = await getHotSpring(hotSpringId);
  if (!hotSpring) {
    throw new Response("Not Found HotSpring", { status: 404 });
  }

  const user = await getUserById(hotSpring.authorId);
  if (!user) {
    throw new Response("Not Found User", { status: 404 });
  }

  const reviews = await getReviewsByHotSpringId(hotSpring.id);

  return json({ hotSpring, user, reviews });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // MEMO: レーティングの値をフォームデータとして取得したい
  const formDataObj = Object.fromEntries(await request.formData());

  const validationResult = CreateReviewSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    console.log(validationResult.error.flatten());
    return json({
      validationErrors: validationResult.error.flatten().fieldErrors,
    });
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  await createReview({
    userId: user.id,
    rating: validationResult.data.rating,
    comment: validationResult.data.comment,
  });

  // TODO: リダイレクトせずにトースターを表示させる
  return jsonWithSuccess(null, "Operation successful! 🎉");
};

export default function HotSpringRoute() {
  const [rating, setRating] = useState(0);
  const { hotSpring, user, reviews } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const validationMessages = actionData?.validationErrors;

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
                      alt={`${hotSpring.title}の画像`}
                      className="rounded-md"
                    />
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-0" />
            </ScrollArea>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {hotSpring?.title}
              </CardTitle>
              <CardDescription>{hotSpring.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{hotSpring.description}</p>
              <Separator className="my-2" />
              <div className="flex items-center gap-2">
                <div>
                  料金: <span>{hotSpring.price}円/泊</span>
                </div>
              </div>
              <Separator className="my-2" />
              <div>
                登録者: <span>{user?.username}</span>
              </div>
              <Separator className="my-2" />
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                最終更新：{" "}
                {format(hotSpring.updatedAt, "yyyy年MM月dd日 HH時MM分")}
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
              <Form method="POST" className="space-y-2">
                <Rating
                  style={{ maxWidth: 180 }}
                  value={rating}
                  onChange={setRating}
                  isRequired
                />
                {validationMessages?.rating && (
                  <p className="text-sm font-bold text-red-500">
                    {validationMessages?.rating[0]}
                  </p>
                )}
                <Textarea
                  id="comment"
                  name="comment"
                  required
                  className="border border-gray-300"
                />
                {validationMessages?.comment && (
                  <p className="text-sm font-bold text-red-500">
                    {validationMessages.comment[0]}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button>投稿する</Button>
                </div>
              </Form>
            </div>
            {/* レビュー表示エリア */}
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {reviews.map((review) => {
                  return (
                    <div
                      key={review.id}
                      className="rounded-md border border-gray-300 p-2 shadow-none"
                    >
                      <div className="font-bold">
                        {review.Reviewer.username}
                      </div>
                      <Rating
                        style={{ maxWidth: 100 }}
                        value={review.rating}
                        readOnly
                      />
                      <p className="line-clamp-2 break-all">{review.body}</p>
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
