export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const REDIRECT_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_REDIRECT_URL;
