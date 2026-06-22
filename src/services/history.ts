import api from "./api";

export const getHistory = async () => {
  const response = await api.get("/history");

  return response.data;
};

export const deleteWish = async (id: string) => {
  const response = await api.delete(`/history/${id}`);

  return response.data;
};

export const deleteMultipleWishes = async (ids: string[]) => {
  const response = await api.delete("/history", {
    data: { ids },
  });

  return response.data;
};
