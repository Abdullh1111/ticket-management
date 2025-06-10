/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainUrl } from "@/URL/main.url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${mainUrl}/chats/`,
    credentials: "include",
  }),
  tagTypes: ["UserTickets"],
  endpoints: (build) => ({
    chatHistory: build.query<any, {userId?: string}>({
      query: (userId) => {
        console.log(userId.userId)
        return {
          url: `${userId.userId || null}`,
          method: "GET",
        }
    },
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useChatHistoryQuery
} = chatApi;
