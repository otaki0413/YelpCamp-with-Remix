import type { HotSpring } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/db.server";

export async function getHotSpring(id: HotSpring["id"]) {
  return await prisma.hotSpring.findUnique({
    where: { id },
    include: {
      Author: true,
    },
  });
}

export async function getHotSprings() {
  return await prisma.hotSpring.findMany({
    select: { id: true, title: true, location: true, url: true },
    orderBy: { updatedAt: "desc" },
  });
}

export const CreateHotSpringSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .min(10, { message: "10文字以上で入力してください。" }),
  price: z.coerce.number().min(1, "1以上の数値を指定してください"),
  location: z.string(),
  image: z.string(),
});

export async function createHotSpring({
  title,
  location,
  price,
  description,
  image,
  authorId,
}: z.infer<typeof CreateHotSpringSchema> & { authorId: string }) {
  try {
    return await prisma.hotSpring.create({
      data: {
        title,
        location,
        price,
        description,
        filename: image,
        Author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}

export async function updateHotSpring({
  id,
  title,
  location,
  price,
  description,
  image,
}: z.infer<typeof CreateHotSpringSchema> & { id: HotSpring["id"] }) {
  try {
    return await prisma.hotSpring.update({
      where: { id },
      data: {
        title,
        location,
        price,
        description,
        filename: image,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}

export async function deleteHotSpring(id: HotSpring["id"]) {
  try {
    return prisma.hotSpring.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}
