import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { jsonWithSuccess, redirectWithSuccess } from "remix-toast";
import { Rating } from "@smastrom/react-rating";
import invariant from "tiny-invariant";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
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
import { deleteHotSpring, getHotSpring } from "~/models/hotspring.server";
import {
  CreateReviewSchema,
  createReview,
  deleteReview,
  getReviewsByHotSpringId,
} from "~/models/review.server";
import { RatingGroup } from "~/components/Rating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

const INTENTS = {
  deleteHotSpringIntent: "deleteHotSpring" as const,
  createReviewIntent: "createReview" as const,
  deleteReviewIntent: "deleteReview" as const,
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // TODO: 認証せずとも閲覧はできるようにしたい
  const currentUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  const hotSpring = await getHotSpring(hotSpringId);
  if (!hotSpring) {
    throw new Response("Not Found HotSpring", { status: 404 });
  }

  const reviews = await getReviewsByHotSpringId(hotSpring.id);

  return json({ hotSpring, currentUser, reviews });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const intent = formData.get("intent");
  switch (intent) {
    case INTENTS.deleteHotSpringIntent: {
      return deleteHotSpringAction({ params });
    }
    case INTENTS.createReviewIntent: {
      return createReviewAction({ request, params });
    }
    case INTENTS.deleteReviewIntent: {
      return deleteReviewAction({ request });
    }
    default: {
      throw new Response(`Invalid intent "${intent}"`, { status: 400 });
    }
  }
};

export default function HotSpringRoute() {
  const { hotSpring, currentUser, reviews } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const validationMessages = actionData?.validationErrors;

  return (
    <div className="w-full p-4">
      <div className="flex max-w-[1200px] flex-col gap-4 md:mx-auto md:flex-row">
        <div className="md:w-3/5">
          <Card>
            <ScrollArea>
              <div className="flex gap-x-4 px-4 pt-4">
                {hotSpring.images.map((image) => {
                  return (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`${hotSpring.title}の画像`}
                      className="border"
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
                登録者: <span>{hotSpring.Author.username}</span>
              </div>
              <Separator className="my-2" />
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                最終更新：{" "}
                {format(hotSpring.updatedAt, "yyyy年MM月dd日 HH時MM分")}
              </div>
              {/* ログインユーザーとレビュアーが一致している場合、編集・削除ボタン表示 */}
              {hotSpring.Author.id === currentUser.id && (
                <div className="flex gap-2">
                  <Link to="edit">
                    <Button variant="outline">編集</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">削除</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          本当に削除しますか？
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          この操作は取り消すことができません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <Form method="POST">
                          <input
                            type="hidden"
                            name="intent"
                            value={INTENTS.deleteHotSpringIntent}
                          />
                          <AlertDialogAction variant="destructive" asChild>
                            <Button type="submit">削除</Button>
                          </AlertDialogAction>
                        </Form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
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
                <input
                  type="hidden"
                  name="intent"
                  value={INTENTS.createReviewIntent}
                />
                <RatingGroup />
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
                    <Form
                      method="POST"
                      key={review.id}
                      className="rounded-md border border-gray-300 p-2 shadow-none"
                    >
                      <input
                        type="hidden"
                        name="intent"
                        value={INTENTS.deleteReviewIntent}
                      />
                      <input type="hidden" name="reviewId" value={review.id} />
                      <div className="flex h-8 items-center justify-between">
                        <div className="font-bold">
                          {review.Reviewer.username}
                        </div>
                        {/* ログインユーザーとレビュアーが一致している場合、削除ボタン表示 */}
                        {currentUser.id === review.reviewerId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1 hover:bg-gray-50"
                          >
                            <Trash2
                              size={20}
                              strokeWidth={1.5}
                              color="#dc5656"
                            />
                          </Button>
                        )}
                      </div>
                      <Rating
                        style={{ maxWidth: 100 }}
                        value={review.rating}
                        readOnly
                      />
                      <p className="line-clamp-2 break-all">{review.body}</p>
                    </Form>
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

// 温泉情報削除用のaction関数
async function deleteHotSpringAction({ params }: { params: Params<string> }) {
  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

  await deleteHotSpring(hotSpringId);

  return redirectWithSuccess("/hotsprings", "温泉情報が削除されました！🔥");
}

// レビュー作成用のaction関数
async function createReviewAction({
  request,
  params,
}: {
  request: Request;
  params: Params<string>;
}) {
  const hotSpringId = params.id;
  invariant(hotSpringId, "Invalid params");

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
    reviewerId: user.id,
    rating: validationResult.data.rating,
    comment: validationResult.data.comment,
    hotSpringId,
  });

  return jsonWithSuccess(null, "レビューが投稿されました！🎉");
}

// レビュー削除用のaction関数
async function deleteReviewAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const reviewId = String(formData.get("reviewId"));
  invariant(reviewId, "Not Found reviewId");

  await deleteReview(reviewId);

  return jsonWithSuccess(null, "レビューが削除されました！🔥");
}
