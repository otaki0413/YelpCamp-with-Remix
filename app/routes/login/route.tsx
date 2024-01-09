import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData);
  return null;
}

export default function Login() {
  return (
    <div className="flex min-h-full items-center justify-center py-40">
      <div className="w-full rounded border p-8 shadow-md sm:mx-auto sm:max-w-md">
        <h2 className="mb-8 text-center text-2xl font-semibold">ログイン</h2>
        <Form method="post">
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              メールアドレス
            </Label>
            <Input type="email" id="email" name="email" required />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="mb-2 block">
              パスワード
            </Label>
            <Input type="password" id="password" name="password" />
          </div>
          <div className="mt-8">
            <Button className="w-full">ログイン</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
