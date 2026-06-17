import axios from "axios";

export const getHistory = async () => {
  const response = await axios.get("http://localhost:5000/api/history");

  return response.data;
};
