import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	ItemDetails,
	PricePayment,
	Shipping,
	TitleCategory,
} from "~/models";
import { listingSchema } from "~/models";

interface ListingState {
	titleCategory: TitleCategory;
	itemDetails: ItemDetails;
	pricePayment: PricePayment;
	shipping: Shipping;
}

const initialState: ListingState = {
	titleCategory: listingSchema.titleCategory,
	itemDetails: listingSchema.itemDetails,
	pricePayment: listingSchema.pricePayment,
	shipping: listingSchema.shipping,
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
