import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth.service";
import priceReducer from "./price.slice";
import { ticketApi } from "./services/ticket.service";
import { chatApi } from "./services/chat.service";
// ...

export const store = configureStore({
  reducer: {
    prices: priceReducer,
    // ...

    [authApi.reducerPath]: authApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [chatApi.reducerPath] : chatApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ticketApi.middleware,
      chatApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
