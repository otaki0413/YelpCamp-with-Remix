import type { HotSpring } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/db.server";

export async function getReviewsByHotSpringId(id: HotSpring["id"]) {
  return await prisma.review.findMany({
    include: {
      Reviewer: {
        select: {
          username: true,
        },
      },
    },
    where: { hotSpringId: id },
    orderBy: { updatedAt: "desc" },
  });
}

export const CreateReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(1, { message: "1文字以上で入力してください。" }),
});

export async function createReview({
  userId,
  rating,
  comment,
}: z.infer<typeof CreateReviewSchema> & { userId: string }) {
  try {
    await prisma.review.create({
      data: {
        rating,
        body: comment,
        Reviewer: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}
