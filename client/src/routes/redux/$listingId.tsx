import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addDays, format } from "date-fns";
import type { RootState } from "~/store";
import {
	setTitleCategory,
	setItemDetails,
	setPricePayment,
	setShipping,
} from "~/store/listingSlice";
import {
	useGetListingQuery,
	useUpdateListingMutation,
	useGetParentCategoriesQuery,
	useGetSubCategoriesQuery,
} from "~/store/listingApi";
import type { Listing } from "~/models";
import Loader from "~/components/loader";
// ... import other components

export const Route = createFileRoute("/redux/$listingId")({
	component: RouteComponent,
});

function RouteComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { listingId } = useParams({ from: Route.id });
	const { titleCategory, itemDetails, pricePayment, shipping } = useSelector(
		(state: RootState) => state.listing,
	);

	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const { data: listingData, isLoading: loadingListing } =
		useGetListingQuery(listingId);
	const { data: parentCatData, isLoading: loadingCategory } =
		useGetParentCategoriesQuery();
	const { data: subCatData, isLoading: loadingSubCategory } =
		useGetSubCategoriesQuery(titleCategory.categoryId || 0);
	const [updateListing] = useUpdateListingMutation();

	useEffect(() => {
		if (listingData) {
			dispatch(setTitleCategory({ ...listingData.titleCategory }));
			dispatch(setItemDetails({ ...listingData.itemDetails }));
			dispatch(setPricePayment({ ...listingData.pricePayment }));
			dispatch(setShipping({ ...listingData.shipping }));
		}
	}, [listingData, dispatch]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const listing: Listing = {
			titleCategory,
			itemDetails,
			pricePayment: {
				...pricePayment,
				reservePrice: pricePayment.reservePrice || "0.00",
			},
			shipping,
		};

		try {
			const result = await updateListing({ id: listingId, listing }).unwrap();
			if (result === 1) {
				navigate({ to: "/redux" });
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : "An error occurred");
		}
	};

	if (loadingListing) return <Loader />;

	return (
		<form onSubmit={handleSubmit}>
			{/* Render form fields */}
			<button type="submit">Update Listing</button>
		</form>
	);
}
