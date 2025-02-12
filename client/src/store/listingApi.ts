import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, Listing, RawListing } from "~/models";

export const listingApi = createApi({
	reducerPath: "listingApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/` }),
	tagTypes: ["Listing", "Category"],
	endpoints: (builder) => ({
		getListings: builder.query<Listing[], void>({
			query: () => "listings",
			transformResponse: (response: RawListing[]) =>
				response.map((listing: RawListing) => ({
					titleCategory: {
						id: listing.id,
						title: listing.title,
						categoryId: listing.categoryid,
						subCategoryId: listing.subcategoryid,
						subTitle: listing.subtitle,
						endDate: listing.enddate,
					},
					itemDetails: {
						description: listing.listingdescription,
						condition: listing.condition,
					},
					pricePayment: {
						listingPrice: listing.listingprice,
						reservePrice: listing.reserveprice,
						creditCardPayment: listing.creditcardpayment,
						bankTransferPayment: listing.banktransferpayment,
						bitcoinPayment: listing.bitcoinpayment,
					},
					shipping: {
						pickUp: listing.pickup,
						shippingOption: listing.shippingoption,
					},
				})),
			providesTags: ["Listing"],
		}),
		getListing: builder.query<Listing, string>({
			query: (id) => `listings/${id}`,
			providesTags: ["Listing"],
			transformResponse: (response: RawListing) => ({
				titleCategory: {
					id: response.id,
					title: response.title,
					categoryId: response.categoryid,
					subCategoryId: response.subcategoryid,
					subTitle: response.subtitle,
					endDate: response.enddate,
				},
				itemDetails: {
					description: response.listingdescription,
					condition: response.condition,
				},
				pricePayment: {
					listingPrice: response.listingprice,
					reservePrice: response.reserveprice,
					creditCardPayment: response.creditcardpayment,
					bankTransferPayment: response.banktransferpayment,
					bitcoinPayment: response.bitcoinpayment,
				},
				shipping: {
					pickUp: response.pickup,
					shippingOption: response.shippingoption,
				},
			}),
		}),
		addListing: builder.mutation<number, { listing: Listing }>({
			query: (body) => ({
				url: "listings",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Listing"],
		}),
		updateListing: builder.mutation<number, { id: string; listing: Listing }>({
			query: ({ id, listing }) => ({
				url: `listings/${id}`,
				method: "PUT",
				body: { listing },
			}),
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
