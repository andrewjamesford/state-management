import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, Listing } from "~/models";

export const listingApi = createApi({
	reducerPath: "listingApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/` }),
	tagTypes: ["Listing", "Category"],
	endpoints: (builder) => ({
		getListings: builder.query<Listing[], void>({
			query: () => "listings",
			transformResponse: (response: Listing[]): Listing[] => response,
			providesTags: ["Listing"],
		}),
		getListing: builder.query<Listing, string>({
			query: (id) => `listings/${id}`,
			providesTags: ["Listing"],
			transformResponse: (response: Listing): Listing => response,
		}),
		addListing: builder.mutation<number, { listing: Listing }>({
			query: ({ listing }) => ({
				url: "listings",
				method: "POST",
				body: listing,
			}),
			transformErrorResponse: (response) => {
				console.error("Error adding listings:", response);
				return response;
			},
			invalidatesTags: ["Listing"],
		}),
		updateListing: builder.mutation<number, { id: string; listing: Listing }>({
			query: ({ id, listing }) => ({
				url: `listings/${id}`,
				method: "PUT",
				body: listing,
			}),
			transformErrorResponse: (response) => {
				return response.data;
			},
			invalidatesTags: ["Listing"],
		}),
		getParentCategories: builder.query<Category[], void>({
			query: () => "categories?parentId=0",
			providesTags: ["Category"],
		}),
		getSubCategories: builder.query<Category[], number>({
			query: (parentId) => `categories?parentId=${parentId}`,
			providesTags: ["Category"],
		}),
	}),
});

export const {
	useGetListingsQuery,
	useGetListingQuery,
	useAddListingMutation,
	useUpdateListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} = listingApi;
