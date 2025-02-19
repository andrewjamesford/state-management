import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
	Listing,
	TitleCategory,
	PricePayment,
	ItemDetails,
	Shipping,
} from "~/models";

const initialState: Listing = {
	titleCategory: {
		id: 0,
		title: "",
		subTitle: "",
		categoryId: 0,
		subCategoryId: 0,
		endDate: "",
	},
	itemDetails: {
		condition: false,
		description: "",
	},
	pricePayment: {
		listingPrice: "0",
		reservePrice: "0",
		creditCardPayment: false,
		bankTransferPayment: false,
		bitcoinPayment: false,
	},
	shipping: {
		pickUp: false,
		shippingOption: "",
	},
};

const listingSlice = createSlice({
	name: "listing",
	initialState,
	reducers: {
		setTitleCategory(state, action: PayloadAction<Partial<TitleCategory>>) {
			state.titleCategory = { ...state.titleCategory, ...action.payload };
		},
		setItemDetails(state, action: PayloadAction<Partial<ItemDetails>>) {
			state.itemDetails = { ...state.itemDetails, ...action.payload };
		},
		setPricePayment(state, action: PayloadAction<Partial<PricePayment>>) {
			state.pricePayment = { ...state.pricePayment, ...action.payload };
		},
		setShipping(state, action: PayloadAction<Partial<Shipping>>) {
			state.shipping = { ...state.shipping, ...action.payload };
		},
		resetState(state) {
			Object.assign(state, initialState);
		},
	},
});

export const {
	setTitleCategory,
	setItemDetails,
	setPricePayment,
	setShipping,
	resetState,
} = listingSlice.actions;
export default listingSlice.reducer;
