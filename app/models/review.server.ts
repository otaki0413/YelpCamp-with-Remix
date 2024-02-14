import type { HotSpring } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getReviewsByHotSpringId(id: HotSpring["id"]) {
  return await prisma.review.findMany({
    where: { hotSpringId: id },
    orderBy: { updatedAt: "desc" },
  });
}
