import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import { useState } from "react";
import api from "~/api";
import ErrorMessage from "~/components/errorMessage";
import ListingForm from "~/forms/listingForm";
import type { Listing } from "~/models";
import { listingDefault } from "~/models";
import { validatePrice } from "~/utils/formValidation";

export const Route = createFileRoute("/tsquery/add")({
	component: RouteComponent,
});

function RouteComponent() {
	// Hardcode listingId as "add"
	const listingId = "add";
	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const [formState, setFormState] = useState(listingDefault);

	const {
		data: categoryData,
		isLoading: loadingCategory,
		error: categoryError,
	} = useQuery({
		queryKey: ["parentCategories"],
		queryFn: async () => {
			const response = await api.getCategories();
			if (!response.ok) throw new Error("Error retrieving categories");
			const result = await response.json();
			return result ?? [];
		},
	});

	const {
		data: subCategoryData,
		isLoading: loadingSubCategory,
		error: subCategoryError,
	} = useQuery({
		queryKey: ["subCategories", formState.categoryId],
		queryFn: async () => {
			if (!formState.categoryId) return [];
			const response = await api.getCategories(formState.categoryId);
			if (!response.ok) throw new Error("Error retrieving sub-categories");
			return await response.json();
		},
	});

	const checkValue = (value: number) => {
		return validatePrice(value);
	};

	const queryClient = useQueryClient();
	const mutation = useMutation<
		{ message: string } | number,
		Error,
		{ listing: Listing }
	>({
		mutationFn: async ({ listing }) => {
			// Always add a new listing
			const response = await api.addListing(listing);
			if (!response.ok) throw new Error("Error adding listing");
			return await response.json();
		},
		onSuccess: (data) => {
			if (data === 1) return navListings();
			// If data is an object, display its message property
			alert(`${JSON.stringify((data as { message: string }).message)}`);
			queryClient.invalidateQueries({
				queryKey: ["listingData", listingId],
			});
		},
		onError: (error: Error) => {
			alert(error.message || "An error occurred");
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkValue(formState.reservePrice)) {
			alert("Invalid reserve price");
			return;
		}
		if (!checkValue(formState.listingPrice)) {
			alert("Invalid listing price");
			return;
		}

		mutation.mutate({
			listing: {
				...formState,
				endDate: formState.endDate.toISOString(),
				listingPrice: formState.listingPrice.toPrecision(2),
				reservePrice: formState.reservePrice.toPrecision(2),
			},
		});
	};

	const navListings = () => {
		return navigate({ to: "/tsquery" });
	};

	if (categoryError)
		return <ErrorMessage message="Error: Error loading Categories" />;
	if (subCategoryError)
		return <ErrorMessage message="Error: Error loading Sub-Categories" />;

	return (
		<form onSubmit={handleSubmit} className="group max-w-4xl mx-auto px-4 py-5">
			<ListingForm
				listingId={0}
				formState={formState}
				setFormState={setFormState}
				tomorrow={tomorrow}
				fortnight={fortnight}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData}
				subCategoryData={subCategoryData}
			/>
		</form>
	);
}
