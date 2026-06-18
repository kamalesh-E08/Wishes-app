import axios from "axios";

export const getHistory = async () => {
  const response = await axios.get("http://localhost:5000/api/history");

  return response.data;
};

export const deleteWish = async (id: string) => {
  await axios.delete(`http://localhost:5000/api/history/${id}`);
};

export const deleteMultipleWishes = async (ids: string[]) => {
  await axios.delete("http://localhost:5000/api/history", {
    data: { ids },
  });
};
