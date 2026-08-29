import apiClient from "./client";

export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    "/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await apiClient.delete(`/files/${fileId}`);
  return response.data;
};