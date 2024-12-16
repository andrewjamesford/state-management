import { addDays, format } from "date-fns";

export const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

interface TitleCategory {
    userId: string;
    title: string;
    categoryId: number;
    subCategoryId: number;
    subTitle: string;
    endDate: string;
}

interface ItemDetails {
    description: string;
    condition: boolean;
}

interface PricePayment {
    listingPrice: string;
    reservePrice: string;
    creditCardPayment: boolean;
    bankTransferPayment: boolean;
    bitcoinPayment: boolean;
}

interface Shipping {
    pickUp: boolean;
    shippingOption: string;
}

export interface ListingSchema {
    titleCategory: TitleCategory;
    itemDetails: ItemDetails;
    pricePayment: PricePayment;
    shipping: Shipping;
}

export const listingSchema: ListingSchema = {
    titleCategory: {
        userId: "",
        title: "",
        categoryId: 0,
        subCategoryId: 0,
        subTitle: "",
        endDate: endDate,
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
        pickUp: true,
        shippingOption: "post",
    },
};
