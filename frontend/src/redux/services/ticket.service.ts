/* eslint-disable @typescript-eslint/no-explicit-any */
import { TComment } from "@/types/Ticket.interface";
import { mainUrl } from "@/URL/main.url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${mainUrl}/tickets/`,
    credentials: "include",
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
      providesTags: ["UserTickets"],
    }),
    SentComments: build.mutation<any, any >({
      query: ({body, ticketId}) => ({
        url: `comments/${ticketId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserTickets"],
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateTicketMutation,
  useUserTicketsQuery,
  useSentCommentsMutation
} = ticketApi;
