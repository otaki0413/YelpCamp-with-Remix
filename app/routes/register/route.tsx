import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CreateUserSchema, createUser } from "~/models/user.server";
import { AUTH_STRATEGY_NAME, authenticator } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  // MEMO: remix-auth側でrequestを使用しているため、ここでcloneする
  const cloneRequest = request.clone();
  const formDataObj = Object.fromEntries(await cloneRequest.formData());

  const validationResult = CreateUserSchema.safeParse(formDataObj);
  if (!validationResult.success) {
    return json({
      error: null,
      validationErrors: validationResult.error.flatten().fieldErrors,
    });
  }

  const result = await createUser(validationResult.data);
  if (result?.error) {
    return json({
      error: result.error,
      validationErrors: null,
    });
  }

  return await authenticator.authenticate(AUTH_STRATEGY_NAME, request, {
    successRedirect: "/hotsprings",
    failureRedirect: "/login",
  });
}

export default function Register() {
  const actionData = useActionData<typeof action>();
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
