import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/auth";

export const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export class AppApiError extends Error {
  code: string;
  statusCode: number;
  details?: Array<{ path: string; message: string }>;
  requestId?: string;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details?: Array<{ path: string; message: string }>,
    requestId?: string
  ) {
    super(message);
    this.name = "AppApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data?.error) {
      const errData = error.response.data;
      throw new AppApiError(
        errData.error.code || "INTERNAL",
        errData.error.message || "An unexpected error occurred",
        error.response.status,
        errData.error.details,
        errData.requestId
      );
    }
    throw new AppApiError(
      "NETWORK_ERROR",
      error.message || "Network request failed",
      error.response?.status || 500
    );
  }
);
