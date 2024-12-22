import { createLazyFileRoute } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { listingSchema } from "~/models/listingSchema";
import api from "~/api";

export const Route = createLazyFileRoute("/single")({
	component: RouteComponent,
});

function RouteComponent() {
	const today = format(new Date(), "yyyy-MM-dd");
	const tomorrow = format(addDays(today, 1), "yyyy-MM-dd");
	const fortnight = format(addDays(today, 14), "yyyy-MM-dd");

	const [categories, setCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);

	const [loadingCategory, setLoadingCategory] = useState(true);
	const [loadingSubCategory, setLoadingSubCategory] = useState(true);

	const [error, setError] = useState(null);

	const [titleCategory, setTitleCategory] = useState(
		listingSchema.titleCategory,
	);
	const [itemDetails, setItemDetails] = useState(listingSchema.itemDetails);
	const [pricePayment, setPricePayment] = useState(listingSchema.pricePayment);
	const [shipping, setShipping] = useState(listingSchema.shipping);
	const [checkRequired, setCheckRequired] = useState();

	const changeData = () => {};

	const checkValue = (value) => {
		if (value > 10) {
			throw new Error("Price must be less than $10");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const listing = {
			titleCategory: titleCategory,
			itemDetails: itemDetails,
			pricePayment: pricePayment,
			shipping: shipping,
		};
		const response = await api.addListing({ listing: listing });

		if (!response.ok) {
			throw new Error("Error adding listing");
		}
		const result = await response.json();

		if (result.error) {
			throw new Error(result.error);
		}

		alert(`${JSON.stringify(result)} listing added`);
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoadingCategory(true);
			try {
				const response = await api.getCategories();
				if (!response.ok) {
					throw new Error("Error retrieving categories");
				}
				const result = await response.json();
				setCategories(result.categories);
			} catch (error) {
				setError(error);
			} finally {
				setLoadingCategory(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setLoadingSubCategory(true);
			try {
				const parentId = titleCategory.categoryId || 0;
				if (Number.parseInt(parentId) === 0) {
					setSubCategories([]);
					return;
				}
				const response = await api.getCategories(parentId);
				if (!response.ok) {
					throw new Error("Error retrieving sub-categories");
				}
				const result = await response.json();
				setSubCategories(result?.categories);
			} catch (error) {
				setError(error);
			} finally {
				setLoadingSubCategory(false);
			}
		};

		fetchData();
	}, [titleCategory.categoryId]);

	if (error) return <p>Error: {error.message}</p>;

	return <div>Hello "/single"!</div>;
}
