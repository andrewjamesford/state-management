import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useState } from "react";
import type { Listing, ListingSchema } from "~/models";
import { listingSchema } from "~/models";
import Loader from "~/components/loader";
import api from "~/api";
import ListingForm from "~/forms/listingForm";
import ErrorMessage from "~/components/errorMessage";

export const Route = createFileRoute("/tsquery/add")({
	component: RouteComponent,
});

interface Category {
	id: number;
	category_name: string;
}

function RouteComponent() {
	// Hardcode listingId as "add"
	const listingId = "add";
	const today = new Date();
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const navigate = useNavigate({
		from: Route.fullPath,
	});

	const [formState, setFormState] = useState(listingSchema);

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
		if (value > 10) {
			throw new Error("Price must be less than $10");
		}
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
		// if (formState.reservePrice === "") formState.reservePrice = "0.00";

		mutation.mutate({ listing: formState });
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
				today={today}
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
