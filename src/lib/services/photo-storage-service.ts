import { uploadPhoto } from "../api/photos";
import { scopedLogger } from "../utils/logger";

const logger = scopedLogger("PhotoStorageService");

export default class PhotoStorageService {
  static async storePhoto(
    file: File
  ): Promise<{ storageUrl: string; thumbUrl: string }> {
    const sizes = await uploadPhoto(file, [
      { width: 800, height: 800 },
      { width: 200, height: 200 },
    ]);

    logger("storePhoto", sizes);

    return {
      storageUrl: sizes.find((size) => size.width === 800)!.url,
      thumbUrl: sizes.find((size) => size.width === 200)!.url,
    };
  }
}
