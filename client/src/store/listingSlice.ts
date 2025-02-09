import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	ItemDetails,
	PricePayment,
	Shipping,
	TitleCategory,
} from "~/models";

interface ListingState {
	titleCategory: TitleCategory;
	itemDetails: ItemDetails;
	pricePayment: PricePayment;
	shipping: Shipping;
}

const initialState: ListingState = {
	titleCategory: {
		id: 0,
		title: "",
		categoryId: 0,
		subCategoryId: 0,
		subTitle: "",
		endDate: "",
	},
	itemDetails: {
		description: "",
		condition: false,
	},
	pricePayment: {
		listingPrice: "",
		reservePrice: "",
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
