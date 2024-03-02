import type { HotSpring, HotSpringImage } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/db.server";

// MEMO: $extendを用いたクライアント拡張は、現状できないっぽいので一旦対応中止
// type HotSpringExtended = {
//   id: string;
//   reviews: Review[];
// };
// const extendedPrisma = prisma.$extends({
//   result: {
//     hotSpring: {
//       ratingAvg: {
//         needs: { reviews: true },
//         compute(hotSpring: HotSpringExtended) {
//           return prisma.review.aggregate({
//             _avg: {
//               rating: true,
//             },
//             where: {
//               hotSpringId: hotSpring.id,
//             },
//           });
//         },
//       },
//     },
//   },
// });

export async function getHotSpring(id: HotSpring["id"]) {
  return await prisma.hotSpring.findUnique({
    where: { id },
    include: {
      Author: true,
      images: true,
    },
  });
}

// TODO: imagesの1件目が存在する場合、表示させる処理入れたい
export async function getHotSprings() {
  return await prisma.hotSpring.findMany({
    select: {
      id: true,
      title: true,
      location: true,
      images: true,
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublicIds(id: HotSpring["id"]) {
  return prisma.hotSpringImage.findMany({
    where: {
      hotSpringId: id,
    },
    select: {
      publicId: true,
    },
  });
}

// TODO: ファイルのバリデーションは今後実装してみたい
// const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
// const ImageFieldSchema = z.object({
//   url: z
//     .instanceof(File)
//     .optional()
//     .refine((file) => {
//       return !file || file.size <= MAX_UPLOAD_SIZE;
//     }, "ファイルサイズが大きすぎます。3MB以下にしてください。"),
// });

export const CreateHotSpringSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .min(10, { message: "10文字以上で入力してください。" }),
  price: z.coerce.number().min(1, "1以上の数値を指定してください"),
  location: z.string(),
  images: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .array(),
});

export async function createHotSpring({
  title,
  location,
  price,
  description,
  images,
  authorId,
}: z.infer<typeof CreateHotSpringSchema> & { authorId: string }) {
  try {
    return await prisma.hotSpring.create({
      data: {
        title,
        location,
        price,
        description,
        images: {
          createMany: {
            data: images.map((image) => {
              return { url: image.url, publicId: image.publicId };
            }),
          },
        },
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

export const UpdateHotSpringSchema = z.object({
  ...CreateHotSpringSchema.shape,
  images: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .array()
    .optional(),
});

export async function updateHotSpring({
  id,
  title,
  location,
  price,
  description,
  images,
}: z.infer<typeof UpdateHotSpringSchema> & { id: HotSpring["id"] }) {
  try {
    // imagesがundefinedでない場合にのみ、dataオブジェクト作成
    let imageData;
    if (images) {
      imageData = {
        createMany: {
          data: images.map((image) => {
            return { url: image.url, publicId: image.publicId };
          }),
        },
      };
    }

    return await prisma.hotSpring.update({
      where: { id },
      data: {
        title,
        location,
        price,
        description,
        images: imageData,
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

export async function deleteHotSpringImages(Ids: HotSpringImage["publicId"][]) {
  try {
    return prisma.hotSpringImage.deleteMany({
      where: {
        publicId: {
          in: Ids,
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}
