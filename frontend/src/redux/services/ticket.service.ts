/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainUrl } from "@/URL/main.url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${mainUrl}/tickets/`,
    credentials: "include",
  }),
  endpoints: (build) => ({
    createTicket: build.mutation<any, any>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateTicketMutation
} = ticketApi;
