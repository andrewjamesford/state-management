import { format, isDate } from "date-fns";
import Checkbox from "~/components/checkbox";
import DateInput from "~/components/dateInput";
import Loader from "~/components/loader";
import MoneyTextInput from "~/components/moneyTextInput";
import RadioButton from "~/components/radioButton";
import Select from "~/components/select";
import SubmitButton from "~/components/submitButton";
import TextInput from "~/components/textInput";
import Textarea from "~/components/textarea";
import type { Category, ListingSchema } from "~/models";

interface ListingFormProps {
	listingId?: number;
	formState: ListingSchema;
	setFormState: React.Dispatch<React.SetStateAction<ListingSchema>>;
	tomorrow: string;
	fortnight: string;
	loadingCategory: boolean;
	loadingSubCategory: boolean;
	categoryData: Category[] | null;
	subCategoryData: Category[] | null;
}

interface SectionProps {
	formState: ListingSchema;
	setFormState: React.Dispatch<React.SetStateAction<ListingSchema>>;
}

interface BasicInfoSectionProps extends SectionProps {
	loadingCategory: boolean;
	loadingSubCategory: boolean;
	categoryData: Category[] | null;
	subCategoryData: Category[] | null;
	tomorrow: string;
	fortnight: string;
}

const handleTextChange =
	(
		field: keyof ListingSchema,
		setFormState: React.Dispatch<React.SetStateAction<ListingSchema>>,
	) =>
	(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = e.target.value ?? "";
		setFormState((prev) => ({
			...prev,
			[field]: value,
		}));
	};

const BasicInfoSection = ({
	formState,
	setFormState,
	loadingCategory,
	loadingSubCategory,
	categoryData,
	subCategoryData,
	tomorrow,
	fortnight,
}: BasicInfoSectionProps) => (
	<>
		<h1 className="mt-4 text-2xl font-bold">What are you listing?</h1>
		<fieldset>
			<legend className="sr-only">Basic Information</legend>
			<div className="mt-6">
				<TextInput
					labelClassName="block text-sm font-medium text-gray-700"
					label="Listing title"
					id="listing-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={formState.title}
					onChange={handleTextChange("title", setFormState)}
					required={true}
					maxLength={80}
					minLength={3}
					className="peer mt-1 block w-full rounded-md border px-3 py-2 placeholder:italic invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600"
					errorMessage="Please enter a listing title of 3-80 characters"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
					requirementsLabel="80 characters max"
					requirementsClassName="mt-1 text-sm text-gray-500"
				/>
			</div>

			<div className="mt-6">
				<TextInput
					labelClassName="block text-sm font-medium text-gray-700"
					label="Subtitle (optional)"
					id="sub-title"
					placeholder="e.g. iPhone 5c, Red t-shirt"
					value={formState.subTitle}
					onChange={handleTextChange("subTitle", setFormState)}
					maxLength={50}
					className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic peer"
					errorMessage="Please enter a listing title of 3-80 characters"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
					requirementsLabel="50 characters max"
					requirementsClassName="mt-1 text-sm text-gray-500"
				/>
			</div>

			<div className="mt-6">
				{loadingCategory ? (
					<Loader width={20} height={20} aria-label="Loading categories" />
				) : (
					categoryData && (
						<Select
							label="Category"
							labelClassName="block text-sm font-medium text-gray-700"
							id="category"
							selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${
								formState.categoryId === 0 ? " italic text-gray-400" : ""
							}`}
							onChange={(e) => {
								const value = Number.parseInt(e.target.value) || 0;
								setFormState((prev) => ({
									...prev,
									categoryId: value,
									subCategoryId: 0,
								}));
							}}
							value={formState.categoryId}
							required={true}
							disabled={loadingCategory}
							aria-busy={loadingCategory}
							options={[
								{
									value: 0,
									label: "Select a category...",
									className: "text-muted-foreground italic",
									disabled: loadingCategory,
								},
								...(categoryData ?? []).map((category: Category) => ({
									value: category.id,
									label: category.category_name,
								})),
							]}
						/>
					)
				)}
			</div>

			<div className="mt-6">
				{loadingSubCategory ? (
					<Loader width={20} height={20} aria-label="Loading sub categories" />
				) : (
					subCategoryData && (
						<Select
							label="Sub Category"
							labelClassName="block text-sm font-medium text-gray-700"
							id="category-sub"
							selectClassName={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background peer ${
								formState.subCategoryId === 0 ? " italic text-gray-400" : ""
							}`}
							onChange={(e) => {
								const value = Number.parseInt(e.target.value) || 0;
								setFormState((prev) => ({
									...prev,
									subCategoryId: value,
								}));
							}}
							value={formState.subCategoryId}
							required={true}
							disabled={
								!subCategoryData ||
								loadingSubCategory ||
								formState.categoryId === 0
							}
							aria-busy={loadingSubCategory}
							options={[
								{
									value: 0,
									label:
										formState.categoryId === 0
											? "Select a category first"
											: "Select a sub category...",
									className: "text-muted-foreground italic",
									disabled: loadingSubCategory || formState.categoryId === 0,
								},
								...(subCategoryData ?? []).map((category: Category) => ({
									value: category.id,
									label: category.category_name,
								})),
							]}
						/>
					)
				)}
			</div>

			<div className="mt-6">
				<DateInput
					label="End date"
					labelClassName="block text-sm font-medium text-gray-700"
					id="end-date"
					value={
						isDate(formState.endDate) &&
						Number.isFinite(formState.endDate.getTime())
							? format(formState.endDate, "yyyy-MM-dd")
							: tomorrow
					}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						const endDate = e.target.value
							? new Date(e.target.value)
							: new Date(tomorrow);
						setFormState((prev) => ({
							...prev,
							endDate: Number.isFinite(endDate.getTime())
								? endDate
								: new Date(tomorrow),
						}));
					}}
					required
					pattern="\d{4}-\d{2}-\d{2}"
					min={tomorrow}
					max={fortnight}
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:default):invalid]:block"
					error="Please select a future date between tomorrow and two weeks from now"
				/>
			</div>
		</fieldset>
	</>
);

const ItemDetailsSection = ({ formState, setFormState }: SectionProps) => (
	<>
		<h1 className="mt-4 text-2xl font-bold">Item details</h1>
		<fieldset>
			<legend className="sr-only">Item Details</legend>
			<div className="mt-6">
				<Textarea
					label="Description"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-description"
					value={formState.description}
					onChange={handleTextChange("description", setFormState)}
					required={true}
					maxLength={500}
					minLength={10}
					className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic"
					placeholder="Describe your item"
					errorClassName="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
					errorMessage="Please enter a description of 10-500 characters"
				/>
			</div>

			<div className="mt-6">
				<legend className="block text-sm font-medium text-gray-700">
					Condition
				</legend>
				<RadioButton
					id="used"
					name="condition"
					value="false"
					label="Used"
					checked={formState.condition === false}
					onChange={() =>
						setFormState((prev) => ({
							...prev,
							condition: false,
						}))
					}
					labelClassName="ml-2 text-sm text-gray-700"
					containerClassName="flex mt-3"
				/>
				<RadioButton
					id="new"
					name="condition"
					value="true"
					label="New"
					checked={formState.condition === true}
					onChange={() =>
						setFormState((prev) => ({
							...prev,
							condition: true,
						}))
					}
					labelClassName="ml-2 text-sm text-gray-700"
					containerClassName="flex mt-3"
				/>
			</div>
		</fieldset>
	</>
);

const PriceAndPaymentSection = ({ formState, setFormState }: SectionProps) => (
	<>
		<h1 className="mt-4 text-2xl font-bold">Price &amp; Payment</h1>
		<fieldset>
			<legend className="sr-only">Price and Payment Information</legend>
			<div className="mt-6">
				<MoneyTextInput
					label="Start price"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-price"
					placeholder="10.00"
					value={formState.listingPrice}
					onChange={(e) => {
						const value = e.target.value ?? "0";
						setFormState((prev) => ({
							...prev,
							listingPrice: Number(value) || 0,
						}));
					}}
				/>
			</div>
			<div className="mt-6">
				<MoneyTextInput
					label="Reserve price (optional)"
					labelClassName="block text-sm font-medium text-gray-700"
					id="listing-reserve"
					placeholder="$20.00"
					value={formState.reservePrice}
					onChange={(e) => {
						const value = e.target.value ?? "0";
						setFormState((prev) => ({
							...prev,
							reservePrice: Number(value) || 0,
						}));
					}}
				/>
			</div>

			<div className="mt-6">
				<legend className="block text-sm font-medium text-gray-700">
					Payment options
				</legend>
				<div className="flex mt-3">
					<Checkbox
						id="payment-credit"
						label="Credit card"
						checked={formState.creditCardPayment}
						onChange={() => {
							setFormState((prev: ListingSchema) => ({
								...prev,
								creditCardPayment: !prev.creditCardPayment,
							}));
						}}
					/>
				</div>
				<div className="flex mt-3">
					<Checkbox
						id="payment-bank"
						label="Bank Transfer"
						checked={formState.bankTransferPayment}
						onChange={() => {
							setFormState((prev: ListingSchema) => ({
								...prev,
								bankTransferPayment: !prev.bankTransferPayment,
							}));
						}}
					/>
				</div>
				<div className="flex mt-3">
					<Checkbox
						id="payment-bitcoin"
						label="Bitcoin"
						checked={formState.bitcoinPayment}
						onChange={() => {
							setFormState((prev: ListingSchema) => ({
								...prev,
								bitcoinPayment: !prev.bitcoinPayment,
							}));
						}}
					/>
				</div>
			</div>
		</fieldset>
	</>
);

const ShippingSection = ({ formState, setFormState }: SectionProps) => (
	<>
		<h1 className="my-4 text-2xl font-bold">Shipping & pick-up</h1>
		<fieldset>
			<legend className="block text-sm font-medium text-gray-700">
				Pick up?
			</legend>
			<div className="mb-6 mt-4">
				<RadioButton
					id="pick-up-true"
					name="pick-up"
					value="true"
					label="Yes"
					checked={formState.pickUp === true}
					onChange={() =>
						setFormState((prev) => ({
							...prev,
							pickUp: true,
						}))
					}
					containerClassName="flex mt-3"
					labelClassName="ml-2 text-sm text-gray-700"
				/>
				<RadioButton
					id="pick-up-false"
					name="pick-up"
					value="false"
					label="No"
					checked={formState.pickUp === false}
					onChange={() =>
						setFormState((prev) => ({
							...prev,
							pickUp: false,
						}))
					}
					containerClassName="flex mt-3"
					labelClassName="ml-2 text-sm text-gray-700"
				/>
			</div>
		</fieldset>

		<fieldset>
			<legend className="block text-sm font-medium text-gray-700">
				Shipping options
			</legend>
			<div className="mb-6 mt-4">
				<RadioButton
					id="shipping-option-courier"
					name="shipping-option"
					value="courier"
					label="Courier"
					checked={formState.shippingOption === "courier"}
					onChange={() =>
						setFormState((prev) => ({
							...prev,
							shippingOption: "courier",
						}))
					}
					containerClassName="flex mt-3"
					labelClassName="ml-2 text-sm text-gray-700"
				/>
				<RadioButton
					id="shipping-option-post"
					name="shipping-option"
					value="post"
					label="Post"
					checked={formState.shippingOption === "post"}
					onChange={() =>
						setFormState((prev) => ({
							...prev,
							shippingOption: "post",
						}))
					}
					containerClassName="flex mt-3"
					labelClassName="ml-2 text-sm text-gray-700"
				/>
			</div>
		</fieldset>
	</>
);

export default function ListingForm(listingFormProps: ListingFormProps) {
	const {
		listingId = 0,
		formState,
		setFormState,
		tomorrow,
		fortnight,
		loadingCategory,
		loadingSubCategory,
		categoryData,
		subCategoryData,
	} = listingFormProps;

	if (loadingCategory || loadingSubCategory) {
		return <Loader aria-label="Loading form data" />;
	}

	return (
		<>
			<BasicInfoSection
				formState={formState}
				setFormState={setFormState}
				loadingCategory={loadingCategory}
				loadingSubCategory={loadingSubCategory}
				categoryData={categoryData}
				subCategoryData={subCategoryData}
				tomorrow={tomorrow}
				fortnight={fortnight}
			/>

			<ItemDetailsSection formState={formState} setFormState={setFormState} />

			<PriceAndPaymentSection
				formState={formState}
				setFormState={setFormState}
			/>

			<ShippingSection formState={formState} setFormState={setFormState} />

			<input type="hidden" name="id" value={listingId} />

			<div className="mt-3">
				<SubmitButton />
			</div>
		</>
	);
}
