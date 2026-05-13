import { put } from "@vercel/blob";

export async function uploadReviewPhoto(file: File, pathname: string): Promise<{ url: string }> {
  const blob = await put(`location-photos/${pathname}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });
  return { url: blob.url };
}
