import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import z from "zod";
import { prisma } from "~/db.server";

const SALT_ROUNDS = 10;

export async function getUserById(id: User["id"]) {
  return await prisma.user.findUnique({ where: { id } });
}

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(4, { message: "4文字以上で入力してください。" })
    .max(20, { message: "20文字以下で入力してください。" }),
  email: z
    .string()
    .email({ message: "正しいメールアドレスの形式で入力してください。" }),
  password: z
    .string()
    .min(5, { message: "5文字以上で入力してください。" })
    .max(20, { message: "20文字以下で入力してください。" }),
});

export async function createUser({
  email,
  username,
  password,
}: z.infer<typeof CreateUserSchema>) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await prisma.user.create({
      data: {
        username,
        email,
        hash: hashedPassword,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "すでに登録済みのユーザーです。",
      };
    }
    console.log(error);
    throw new Error("Unexpected error");
  }
}
