import api from "./api";
import { auth } from "./auth";

export const uploadExcel = (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post("/events/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "firebase-uid": auth.currentUser?.uid || "",
    },
  });
};

export const fetchEventsBySource = (source: "excel" | "onedrive") => {
  return api.get(`/events?source=${source}`, {
    headers: {
      "firebase-uid": auth.currentUser?.uid || "",
    },
  });
};

export const importOneDriveEvents = (events: any[]) => {
  return api.post("/events/import-json", events, {
    headers: {
      "firebase-uid": auth.currentUser?.uid || "",
    },
  });
};

export const saveGeneratedWish = (
  eventId: string,
  payload: {
    generatedWishImage: string;
    generatedWishText: string;
  },
) => {
  return api.put(`/events/${eventId}/generated`, payload, {
    headers: {
      "firebase-uid": auth.currentUser?.uid || "",
    },
  });
};
