import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { v4 as uuidv4 } from "uuid";

export const generateRandomId = () => {
  const id = uuidv4();
  return id;
};

export enum Role {
  buyer = "buyer",
  seller = "seller",
  admin = "admin",
}

export const handleRtkQueryError = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return "Unknown error occurred!";

  if ('data' in error && typeof error.data === 'object' && error.data !== null) {
    if ('error' in error.data && typeof error.data.error === 'string') {
      return error.data.error;
    }
  }

  if ('message' in error) {
    return error.message || '';
  }

  return "An unexpected error occurred!";
};

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
