/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainUrl } from "@/URL/main.url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${mainUrl}/auth/`,
    credentials: "include",
    prepareHeaders(headers, api) {
      const token = localStorage.getItem("accessToken");
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
    logout: build.mutation<any, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    allUser: build.query<any, void>({
      query: () => ({
        url: "allUser",
        method: "GET",
      }),
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useAllUserQuery
} = authApi;