import { getPageAndPath } from "@/utils/getPageAndPath";
import { usePath, useUrl } from "crossroad";
import { useState } from "react";
/**
 * PageThree component handles the third page of a multi-page form.
 * It allows users to input price and payment options.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.values - The initial values for the form fields.
 * @param {Function} props.setFormState - Function to update the form state.
 * @param {Function} props.handleLoadDraft - Function to load a draft.
 * @param {boolean} props.draftAvailable - Flag indicating if a draft is available.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function PageThree({
	values,
	setFormState,
	handleLoadDraft,
	draftAvailable,
}) {
	const path = usePath();
	const { page, step } = getPageAndPath(path);

	const [pricePayment, setPricePayment] = useState(values);
	const [, setUrl] = useUrl();

	const changeData = () => {
		setFormState(pricePayment);
		setCheckRequired(checkPaymentRequired());
	};

	const checkPaymentRequired = () => {
		// Check if at least one payment option is selected
		if (
			pricePayment.creditCardPayment === true ||
			pricePayment.bankTransferPayment === true ||
			pricePayment.bitcoinPayment === true
		) {
			return false;
		}
		return true;
	};
	const [checkRequired, setCheckRequired] = useState(checkPaymentRequired());

	const nextForm = () => {
		setUrl(`/${page}/${step + 1}`);
	};

	const previousForm = () => {
		changeData();
		setUrl(`/${page}/${step - 1}`);
	};

	const handleSubmit = () => {
		changeData();
		nextForm();
	};

	return (
		<form onSubmit={handleSubmit} noValidate className="group">
			<h1 className="mt-4 text-2xl font-bold">Price &amp; Payment</h1>
			<div className="mt-6">
				<label
					htmlFor="listing-price"
					className="block text-sm font-medium text-gray-700"
				>
					Start price
				</label>
				<span className="flex">
					<span className="pt-3 pr-2 text-lg">$</span>
					<input
						id="listing-price"
						placeholder="$10.00"
						className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic"
						type="number"
						min={1}
						step={1}
						value={pricePayment.listingPrice}
						required={true}
						onChange={(e) => {
							setPricePayment({
								...pricePayment,
								listingPrice: e.target.value,
							});
						}}
						onBlur={changeData}
					/>
				</span>
			</div>
			<div className="mt-6">
				<label
					htmlFor="listing-reserve"
					className="block text-sm font-medium text-gray-700"
				>
					Reserve price (optional)
				</label>
				<span className="flex">
					<span className="pt-3 pr-2 text-lg">$</span>
					<input
						id="listing-reserve"
						placeholder="$20.00"
						className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic"
						type="number"
						min={0}
						step={1}
						value={pricePayment.reservePrice}
						onChange={(e) => {
							setPricePayment({
								...pricePayment,
								reservePrice: e.target.value,
							});
						}}
						onBlur={changeData}
					/>
				</span>
			</div>
			<fieldset>
				<legend className="sr-only">Payment options</legend>
				<div className="mt-6">
					<label
						htmlFor="category"
						className="block text-sm font-medium text-gray-700"
					>
						Payment options
					</label>
					<div className="flex mt-3">
						<input
							type="checkbox"
							id="payment-credit"
							name="payment-type"
							value="credit-card"
							onChange={() => {
								setPricePayment({
									...pricePayment,
									creditCardPayment: !pricePayment.creditCardPayment,
								});
								checkPaymentRequired();
							}}
							onBlur={changeData}
							checked={pricePayment.creditCardPayment}
							required={checkRequired}
						/>

						<label
							htmlFor="payment-credit"
							className="ml-2 text-sm text-gray-700"
						>
							Credit Card
						</label>
					</div>
					<div className="flex mt-3">
						<input
							type="checkbox"
							id="payment-bank"
							name="payment-type"
							value="bank-transfer"
							onChange={() => {
								setPricePayment({
									...pricePayment,
									bankTransferPayment: !pricePayment.bankTransferPayment,
								});
								checkPaymentRequired();
							}}
							onBlur={changeData}
							checked={pricePayment.bankTransferPayment}
							required={checkRequired}
						/>

						<label
							htmlFor="payment-bank"
							className="ml-2 text-sm text-gray-700"
						>
							Bank Transfer
						</label>
					</div>
					<div className="flex mt-3">
						<input
							type="checkbox"
							id="payment-bitcoin"
							name="payment-type"
							value="bitcoin"
							onChange={() => {
								setPricePayment({
									...pricePayment,
									bitcoinPayment: !pricePayment.bitcoinPayment,
								});
								checkPaymentRequired();
							}}
							onBlur={changeData}
							checked={pricePayment.bitcoinPayment}
							required={checkRequired}
						/>
						<label
							htmlFor="payment-bitcoin"
							className="ml-2 text-sm text-gray-700"
						>
							Bitcoin
						</label>
					</div>
				</div>
			</fieldset>

			<div className="mt-6 grid md:grid-flow-col md:w-1/2 gap-2">
				<button
					type="button"
					onClick={previousForm}
					className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-primary/30 h-10 px-4 py-2"
				>
					Previous
				</button>

				<button
					type="submit"
					onClick={changeData}
					className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 group-invalid:pointer-events-none group-invalid:opacity-30"
				>
					Next
				</button>
				{draftAvailable && (
					<button
						type="button"
						onClick={() => handleLoadDraft(values.titleCategory.userId)}
						className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-primary hover:bg-primary/20 h-10 px-4 py-2	 border border-card-primary/"
					>
						Load Draft
					</button>
				)}
			</div>
		</form>
	);
}
