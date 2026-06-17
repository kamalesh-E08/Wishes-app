import axios from "axios";

export async function generateWish(payload: unknown) {
  const response = await axios.post(
    "http://localhost:5000/api/generate",
    payload,
  );
  console.log(response.data);
  return response.data;
}
