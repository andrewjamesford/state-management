import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Listing } from "~/models";

const initialState: Listing = {
	id: 0,
	title: "",
	subTitle: "",
	categoryId: 0,
	subCategoryId: 0,
	endDate: new Date(),
	condition: false,
	description: "",
	listingPrice: 0,
	reservePrice: 0,
	creditCardPayment: false,
	bankTransferPayment: false,
	bitcoinPayment: false,
	pickUp: false,
	shippingOption: "",
};

const listingSlice = createSlice({
	name: "listing",
	initialState,
	reducers: {
		setListing(state, action: PayloadAction<Partial<Listing>>) {
			Object.assign(state, action.payload);
		},
		resetState(state) {
			Object.assign(state, initialState);
		},
	},
});

export const { setListing, resetState } = listingSlice.actions;
export default listingSlice.reducer;
