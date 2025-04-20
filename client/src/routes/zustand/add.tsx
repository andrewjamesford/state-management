import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";
import ListingForm from "~/forms/listingForm";
import type { ListingSchema } from "~/models";
import { listingSchema } from "~/models";
import { useListingStore } from "~/store/zustand/listingStore";

export const Route = createFileRoute("/zustand/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const {
		categories,
		subCategories,
		isLoading,
		error,
		fetchCategories,
		fetchSubCategories,
		addListing,
	} = useListingStore();

	const [formState, setFormState] = useState<ListingSchema>(() => ({
		...listingSchema,
		endDate: new Date(tomorrow),
	}));

	// Fetch categories on mount
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Fetch subcategories when category changes
	useEffect(() => {
		if (formState.categoryId) {
			fetchSubCategories(formState.categoryId);
		}
	}, [formState.categoryId, fetchSubCategories]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await addListing({
				...formState,
				endDate: formState.endDate,
				listingPrice: formState.listingPrice,
				reservePrice: formState.reservePrice,
			});
			navigate({ to: "/zustand" });
		} catch (error) {
			console.error("Failed to add listing:", error);
		}
	};

	if (error) return <ErrorMessage message={error} />;
	if (isLoading) return <Loader height={50} width={50} />;

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-5">
			<ListingForm
				listingId={0}
				formState={formState}
				setFormState={setFormState}
				tomorrow={tomorrow}
				fortnight={fortnight}
				loadingCategory={isLoading}
				loadingSubCategory={isLoading}
				categoryData={categories}
				subCategoryData={subCategories}
			/>
		</form>
	);
}
