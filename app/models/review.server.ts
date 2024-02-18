import type { HotSpring, Review } from "@prisma/client";
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
  rating: z.coerce
    .number()
    .min(1, "1以上のレビューをつけてください。")
    .max(5, "5以上のレビューはつけられません。")
    .default(0),
  comment: z
    .string()
    .min(5, { message: "コメントは5文字以上で入力して下さい。" }),
});

export async function createReview({
  reviewerId,
  rating,
  comment,
  hotSpringId,
}: z.infer<typeof CreateReviewSchema> & {
  reviewerId: string;
  hotSpringId: string;
}) {
  try {
    await prisma.review.create({
      data: {
        rating,
        body: comment,
        reviewerId,
        hotSpringId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}

export async function deleteReview(id: Review["id"]) {
  try {
    return prisma.review.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}
