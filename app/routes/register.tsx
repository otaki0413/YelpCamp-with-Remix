import { Form, redirect } from "react-router";
import { dataWithError, redirectWithError } from "remix-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CreateUserSchema, createUser } from "~/models/user.server";
import { AUTH_STRATEGY_NAME, authenticator } from "~/services/auth.server";
import type { Route } from ".react-router/types/app/routes/+types/register";
import {
  commitSession,
  getSession,
  getSessionUser,
  SESSION_KEY,
} from "~/services/session.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await getSessionUser(request);
  if (user) {
    return redirect("/hotsprings");
  }
  return null;
};

export async function action({ request }: Route.ActionArgs) {
  // フォームデータのバリデーション
  const cloneRequest = request.clone();
  const formDataObj = Object.fromEntries(await cloneRequest.formData());
  const validationResult = CreateUserSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    return {
      error: null,
      validationErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  // ユーザー登録処理
  const result = await createUser(validationResult.data);
  if (result?.error) {
    return dataWithError(null, result.error);
  }

  // 認証処理
  try {
    const user = await authenticator.authenticate(AUTH_STRATEGY_NAME, request);
    const session = await getSession(request.headers.get("cookie"));
    session.set(SESSION_KEY, user);
    return redirect("/hotsprings", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    // 認証成功時には、Responseのerrorを返すことで正常なリダイレクトを行う
    if (error instanceof Response) return error;
    if (error instanceof Error) {
      return redirectWithError("/register", error.message);
    }
    console.log(error);
    throw new Error("Unexpected Error");
  }
}

export default function Register({ actionData }: Route.ComponentProps) {
  const validationMessages = actionData?.validationErrors;

  return (
    <div className="flex min-h-full items-center justify-center py-40">
      <div className="w-full rounded border p-8 shadow-md sm:mx-auto sm:max-w-md">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          ユーザー登録
        </h2>
        <Form method="POST">
          <div className="mb-4">
            <Label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              ユーザー名
            </Label>
            <Input type="text" id="username" name="username" required />
            {validationMessages?.username && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.username[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              メールアドレス
            </Label>
            <Input type="email" id="email" name="email" required />
            {validationMessages?.email && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.email[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="mb-2 block">
              パスワード
            </Label>
            <Input type="password" id="password" name="password" />
            {validationMessages?.password && (
              <p className="text-sm font-bold text-red-500">
                {validationMessages.password[0]}
              </p>
            )}
          </div>

          <div className="mt-8">
            <Button className="w-full">登録する</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
