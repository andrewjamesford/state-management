import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addDays } from "date-fns";
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
	const tomorrow = new Date(addDays(today, 1));
	const fortnight = new Date(addDays(today, 14));

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
			const result = await api.getCategories();
			if (!result) throw new Error("Error retrieving categories");
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
			if (!response) throw new Error("Error retrieving sub-categories");
			const result = response;
			return result ?? [];
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
			const result = await api.addListing(listing);
			if (!result) throw new Error("Error adding listing");
			if (
				typeof result.id === "number" ||
				(typeof result === "object" && "message" in result)
			) {
				return 1;
			}
			return 0;
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
				endDate: formState.endDate,
				listingPrice: formState.listingPrice,
				reservePrice: formState.reservePrice,
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
				minDate={tomorrow}
				maxDate={fortnight}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData ?? []}
				subCategoryData={subCategoryData ?? []}
			/>
		</form>
	);
}
