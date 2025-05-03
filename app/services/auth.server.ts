import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { prisma } from "~/db.server";

export const AUTH_STRATEGY_NAME = "user-path";

export const authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const user = await login({ email, password });
    return user;
  }),
  AUTH_STRATEGY_NAME,
);

export const AuthSchema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスの形式で入力してください。" }),
  password: z
    .string()
    .min(5, { message: "5文字以上で入力してください。" })
    .max(20, { message: "20文字以下で入力してください。" }),
});

async function login({ email, password }: z.infer<typeof AuthSchema>) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.hash))) {
    throw Error(
      "ログインに失敗しました。アカウント名とパスワードを再度ご確認ください。",
    );
  }

  return user;
}
