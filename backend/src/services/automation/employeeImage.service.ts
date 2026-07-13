import { compressImageFromUrl } from "../imageProcessor";

export async function getCompressedEmployeeImage(photoUrl: string) {
  if (!photoUrl) {
    throw new Error("Employee photo URL missing");
  }

  return await compressImageFromUrl(photoUrl);
}
