import api from "./api";

export const generateAll = (source: "excel" | "onedrive") => {
  return api.post("/automation/generate", {
    source,
  });
};
