import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, Listing } from "~/models";

interface RawListing {
	id: number;
	title: string;
	subtitle: string;
	categoryid: number;
	subcategoryid: number;
	enddate: string;
	condition: boolean;
	listingdescription: string;
	listingprice: string;
	reserveprice: string;
	creditcardpayment: boolean;
	banktransferpayment: boolean;
	bitcoinpayment: boolean;
	pickup: boolean;
	shippingoption: string;
}

export const listingApi = createApi({
	reducerPath: "listingApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/` }),
	tagTypes: ["Listing", "Category"],
	endpoints: (builder) => ({
		getListings: builder.query<Listing[], void>({
			query: () => "listings",
			transformResponse: (response: RawListing[]): Listing[] =>
				response.map((item) => ({
					id: item.id,
					title: item.title,
					subTitle: item.subtitle,
					categoryId: item.categoryid,
					subCategoryId: item.subcategoryid,
					endDate: item.enddate,
					condition: item.condition,
					description: item.listingdescription,
					listingPrice: item.listingprice,
					reservePrice: item.reserveprice,
					creditCardPayment: item.creditcardpayment,
					bankTransferPayment: item.banktransferpayment,
					bitcoinPayment: item.bitcoinpayment,
					pickUp: item.pickup,
					shippingOption: item.shippingoption,
				})),
			providesTags: ["Listing"],
		}),
		getListing: builder.query<Listing, string>({
			query: (id) => `listings/${id}`,
			providesTags: ["Listing"],
			transformResponse: (response: RawListing): Listing => ({
				id: response.id,
				title: response.title,
				subTitle: response.subtitle,
				categoryId: response.categoryid,
				subCategoryId: response.subcategoryid,
				endDate: response.enddate,
				condition: response.condition,
				description: response.listingdescription,
				listingPrice: response.listingprice,
				reservePrice: response.reserveprice,
				creditCardPayment: response.creditcardpayment,
				bankTransferPayment: response.banktransferpayment,
				bitcoinPayment: response.bitcoinpayment,
				pickUp: response.pickup,
				shippingOption: response.shippingoption,
			}),
		}),
		addListing: builder.mutation<number, { listing: Listing }>({
			query: ({ listing }) => ({
				url: "listings",
				method: "POST",
				body: listing,
			}),
			invalidatesTags: ["Listing"],
		}),
		updateListing: builder.mutation<number, { id: string; listing: Listing }>({
			query: ({ id, listing }) => ({
				url: `listings/${id}`,
				method: "PUT",
				body: listing,
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
