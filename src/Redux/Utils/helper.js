import axios from "axios";
import { getAccessToken } from "./localStore";

export const BASE_URL = "https://suit-sync.koderspedia.net";

export const fetchApi = async ({
  method,
  endPoint,
  token = true,
  data,
  params,
  formData = false,
}) => {
  const headers = {};

  if (token) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  if (!formData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    url: `${BASE_URL}/api/${endPoint}`,
    headers,
    data: data || undefined,
    params: params || undefined,
  };

  // 👇 Only request log
  console.log("API REQUEST:", config);

  try {
    const response = await axios(config);

    // 👇 Only success log
    console.log("API SUCCESS:", response.data);

    return response.data;
  } catch (error) {
    // 👇 Only error log
    console.log("API ERROR:", error.response?.data || error.message);

    throw error;
  }
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToFile = (base64, filename) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

