/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainUrl } from "@/URL/main.url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${mainUrl}/auth/`,
    prepareHeaders: (headers) => {
      // Get token from sessionStorage
      const token = sessionStorage.getItem("adminToken"); // Replace 'authToken' with your key

      // If token exists, add it to headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    login: build.mutation<any, any>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    register: build.mutation<any, any>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;
