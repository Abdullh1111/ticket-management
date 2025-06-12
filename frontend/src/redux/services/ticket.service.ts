/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainUrl } from "@/URL/main.url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${mainUrl}/tickets/`,
    credentials: "include",
    prepareHeaders(headers) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["UserTickets"],
  endpoints: (build) => ({
    createTicket: build.mutation<any, any>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
    }),
    userTickets: build.query<any, void>({
      query: () => ({
        url: "userTickets",
        method: "GET",
      }),
    }),

    AdminTickets: build.query<any, void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),

    SentComments: build.mutation<any, any >({
      query: ({body, ticketId}) => ({
        url: `comments/${ticketId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserTickets"],
    }),
    updateTicket: build.mutation<any, {body: {status: string}, ticketId: string}>({
      query: ({body, ticketId}) => ({
        url: `${ticketId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["UserTickets"],
    }),
    fineOneTicket: build.query<any, string>({
      query: (id) => ({
        url: `${id}`,
        method: "GET",
      }),
      providesTags: ["UserTickets"],
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateTicketMutation,
  useUserTicketsQuery,
  useSentCommentsMutation,
  useAdminTicketsQuery,
  useUpdateTicketMutation,
  useFineOneTicketQuery
} = ticketApi;
