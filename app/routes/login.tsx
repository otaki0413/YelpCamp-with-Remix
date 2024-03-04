import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { redirectWithError } from "remix-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  AUTH_STRATEGY_NAME,
  AuthSchema,
  authenticator,
} from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/hotsprings",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const cloneRequest = request.clone();
  const formDataObj = Object.fromEntries(await cloneRequest.formData());

  const validationResult = AuthSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    return json({
      error: null,
      validationErrors: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    // 認証失敗時のリダイレクト先を指定しないことで、nullを返さず意図的にAuthorizationErrorを出す
    return await authenticator.authenticate(AUTH_STRATEGY_NAME, request, {
      successRedirect: "/hotsprings",
      throwOnError: true,
    });
  } catch (error) {
    // 認証成功時には、Responseのerrorを返すことで正常なリダイレクトを行う
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return redirectWithError("/login", error.message);
    }
    console.log(error);
    throw new Error("Unexpected Error");
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const validationMessages = actionData?.validationErrors;

  return (
    <div className="flex min-h-full items-center justify-center py-40">
      <div className="w-full rounded border p-8 shadow-md sm:mx-auto sm:max-w-md">
        <h2 className="mb-8 text-center text-2xl font-semibold">ログイン</h2>
        <Form method="POST">
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
            <Button className="w-full">ログイン</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
