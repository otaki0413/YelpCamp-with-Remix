import type { UploadApiResponse, UploadStream } from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream: UploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "HotSprings",
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

// 環境変数の出力
// console.log("configs", cloudinary.v2.config());
