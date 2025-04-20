import { configureStore } from "@reduxjs/toolkit";
import { listingApi } from "./listingApi";

export const store = configureStore({
	reducer: {
		[listingApi.reducerPath]: listingApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(listingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
