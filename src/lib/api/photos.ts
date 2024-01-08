import { api } from "./api";

type UploadedPhoto = { width: number; height: number; url: string };
export const uploadPhoto = async (
  photo: File,
  dimensions: { width: number; height: number }[] = [
    { width: 800, height: 800 },
  ]
): Promise<UploadedPhoto[]> => {
  const formData = new FormData();
  formData.append("photo_file", photo);
  formData.append("dimensions", JSON.stringify(dimensions));

  return await api.userAuth.post<UploadedPhoto[]>(
    "/api/v2/user/:firebase_uid/files/photos",
    formData,
    {},
    {
      "Content-Type": "multipart/form-data",
    }
  );
};
