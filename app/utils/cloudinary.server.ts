import type { UploadApiResponse, UploadStream } from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const CLOUDINARY_FOLDER_NAME = "HotSprings";

export async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream: UploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER_NAME,
          unique_filename: true,
        },
        // アップロード完了時のコールバック
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          // resultの型エラーを防ぐために記述したが、いいやり方があれば改善したい
          if (result === undefined) {
            return;
          }
          resolve(result);
        },
      );

      // ファイルデータをCloudinaryにアップロード
      await writeAsyncIterableToWritable(data, uploadStream);
    },
  );

  return uploadPromise;
}

// 特定のpublic_idを持つ画像を削除する
export async function deleteImageById(id: string) {
  try {
    const result: { result: string } = await cloudinary.v2.uploader.destroy(id);
    if (result.result !== "ok") {
      throw new Error("画像の削除に失敗しました");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected error");
  }
}

// 環境変数の出力
// console.log("configs", cloudinary.v2.config());
