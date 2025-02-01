import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { listingSchema } from '~/models/listingSchema'
import Loader from '~/components/loader'
import api from '~/api'

export const Route = createFileRoute('/zustand/$listingId')({
  component: RouteComponent,
})

interface Listing {
  titleCategory: typeof listingSchema.titleCategory
  itemDetails: typeof listingSchema.itemDetails
  pricePayment: typeof listingSchema.pricePayment
  shipping: typeof listingSchema.shipping
}

interface Category {
  id: number
  category_name: string
}

function RouteComponent() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(today, 1), 'yyyy-MM-dd')
  const fortnight = format(addDays(today, 14), 'yyyy-MM-dd')

  const [titleCategory, setTitleCategory] = useState(
    listingSchema.titleCategory,
  )
  const [itemDetails, setItemDetails] = useState(listingSchema.itemDetails)
  const [pricePayment, setPricePayment] = useState(listingSchema.pricePayment)
  const [shipping, setShipping] = useState(listingSchema.shipping)
  const [checkRequired, setCheckRequired] = useState()

  const changeData = () => {}

  const checkValue = (value: number) => {
    if (value > 10) {
      throw new Error('Price must be less than $10')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const listing: Listing = {
      titleCategory: titleCategory,
      itemDetails: itemDetails,
      pricePayment: pricePayment,
      shipping: shipping,
    }
    const response = await api.addListing({ listing: listing })

    if (!response.ok) {
      throw new Error('Error adding listing')
    }
    const result = await response.json()

    if (result.error) {
      throw new Error(result.error)
    }

    alert(`${JSON.stringify(result)} listing added`)
  }

  const {
    data: parentCatData,
    isLoading: loadingCategory,
    error: parentError,
  } = useQuery({
    queryKey: ['parentCategories'],
    queryFn: async () => {
      const response = await api.getCategories()
      console.log('response', response)
      if (!response.ok) throw new Error('Error retrieving categories')
      const result = await response.json()
      console.log('result', result)
      return result ?? []
    },
  })

  const {
    data: subCatData,
    isLoading: loadingSubCategory,
    error: subCatError,
  } = useQuery({
    queryKey: ['subCategories', titleCategory.categoryId],
    queryFn: async () => {
      console.log('subCatData titleCategory', titleCategory.categoryId)
      if (!titleCategory.categoryId) return []
      const response = await api.getCategories(titleCategory.categoryId)
      console.log('sub response', response)
      if (!response.ok) throw new Error('Error retrieving sub-categories')
      return await response.json()
    },
  })

  if (parentError) return <p>Error: {parentError.message}</p>
  if (subCatError) return <p>Error: {subCatError.message}</p>

  console.log('parentCatData', parentCatData)
  console.log('subCatData', subCatData)

  return (
    <form onSubmit={handleSubmit} noValidate className="group">
      <h1 className="mt-4 text-2xl font-bold">What are you listing?</h1>

      <div className="mt-6">
        <label
          htmlFor="listing-title"
          className="block text-sm font-medium text-gray-700"
        >
          Listing title
        </label>
        <input
          id="listing-title"
          placeholder="e.g. iPhone 5c, Red t-shirt"
          className="peer mt-1 block w-full rounded-md border px-3 py-2 placeholder:italic invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600"
          type="text"
          onChange={(e) => {
            const value = e.target.value ?? ''
            console.log('value', value)
            setTitleCategory({
              ...titleCategory,
              title: value,
            })
          }}
          value={titleCategory.title}
          onBlur={changeData}
          required={true}
          maxLength={80}
          minLength={3}
        />
        <span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please enter a listing title of 3-80 characters
        </span>
        <p className="mt-1 text-sm text-gray-500 ">80 characters max</p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="sub-title"
          className="block text-sm font-medium text-gray-700"
        >
          Subtitle (optional)
        </label>
        <input
          id="sub-title"
          placeholder="e.g. iPhone 5c, Red t-shirt"
          className="block w-full px-3 py-2 mt-1 border rounded-md placeholder:italic peer"
          type="text"
          onChange={(e) => {
            const value = e.target.value ?? ''
            setTitleCategory({
              ...titleCategory,
              subTitle: value,
            })
          }}
          value={titleCategory.subTitle}
          onBlur={changeData}
          maxLength={50}
        />
        <span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please enter a subtitle of max 50 characters
        </span>
        <p className="mt-1 text-sm text-gray-500">50 characters max</p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 "
        >
          Category
        </label>
        <div className="mt-1">
          {loadingCategory && <Loader width={20} height={20} />}
          {!loadingCategory && (
            <select
              id="category"
              // placeholder="Select a category"
              className={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background  peer ${titleCategory.categoryId === 0 ? ' italic text-gray-400' : ''}`}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = Number.parseInt(e.target.value) || 0
                setTitleCategory({
                  ...titleCategory,
                  categoryId: value,
                  subCategoryId: 0, // reset subcategory
                })
              }}
              value={titleCategory.categoryId}
              onBlur={changeData}
              required={true}
              // pattern="\d+"
            >
              <option value="" className="text-muted-foreground italic">
                Select a category...
              </option>
              {parentCatData?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          )}
          <span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:selected):invalid]:block">
            Please select a category
          </span>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="category-sub"
          className="block text-sm font-medium text-gray-700"
        >
          Sub Category
        </label>
        <div className="mt-1">
          {loadingSubCategory && <Loader width={20} height={20} />}
          {!loadingSubCategory && (
            <select
              id="category-sub"
              // placeholder="Select a sub category"
              className={`block w-full h-10 px-3 py-2 items-center justify-between rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 placeholder:italic ${titleCategory.subCategoryId === 0 ? ' italic text-gray-400' : ''}`}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value) || 0
                setTitleCategory({
                  ...titleCategory,
                  subCategoryId: value,
                })
              }}
              value={titleCategory.subCategoryId}
              onBlur={changeData}
              required={true}
              disabled={subCatData.length === 0}
            >
              <option value="" className="text-muted-foreground italic">
                Select a sub category...
              </option>
              {subCatData?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="end-date"
          className="block text-sm font-medium text-gray-700"
        >
          End date
        </label>
        <input
          id="end-date"
          className="block w-full px-3 py-2 mt-1 border rounded-md text-black focus:ring-primary focus:border-primary focus:bg-transparent placeholder:italic peer"
          type="date"
          onChange={(e) => {
            const value = e.target.value ?? ''
            setTitleCategory({
              ...titleCategory,
              endDate: value,
            })
          }}
          value={titleCategory.endDate}
          onBlur={changeData}
          required={true}
          pattern="\d{4}-\d{2}-\d{2}"
          min={tomorrow}
          max={fortnight}
        />
        <span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:default):invalid]:block">
          Please select a future date between tomorrow and two weeks from now
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold">Item details</h1>
      <div className="mt-6">
        <label
          htmlFor="listing-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="listing-description"
          className="block w-full px-3 py-2 mt-1 border rounded-md invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600 peer"
          value={itemDetails.description}
          onChange={(e) => {
            const value = e.target.value ?? ''
            setItemDetails({ ...itemDetails, description: value })
          }}
          onBlur={changeData}
          required={true}
          maxLength={500}
          minLength={10}
          placeholder="Describe your item"
        />
        <span className="mt-1 hidden text-sm text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please enter a description of 10-500 characters
        </span>
      </div>
      <fieldset>
        <legend className="sr-only">Condition</legend>
        <div className="mt-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Condition
          </label>
          <div className="flex mt-3">
            <input
              type="radio"
              id="used"
              name="condition"
              value="false"
              checked={itemDetails.condition === false}
              onChange={() => {
                setItemDetails({ ...itemDetails, condition: false })
              }}
              onBlur={changeData}
            />
            <label htmlFor="used" className="ml-2 text-sm text-gray-700">
              Used
            </label>
          </div>
          <div className="flex mt-3">
            <input
              type="radio"
              id="new"
              name="condition"
              value="true"
              checked={itemDetails.condition === true}
              onChange={() => {
                setItemDetails({ ...itemDetails, condition: true })
              }}
              onBlur={changeData}
            />
            <label htmlFor="new" className="ml-2 text-sm text-gray-700">
              New
            </label>
          </div>
        </div>
      </fieldset>

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
              checkValue(Number(e.target.value))
              setPricePayment({
                ...pricePayment,
                listingPrice: e.target.value,
              })
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
              })
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
                })
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
                })
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
                })
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

      <h1 className="mt-4 text-2xl font-bold">Shipping & pick-up</h1>
      <fieldset>
        <legend className="sr-only">Pick up?</legend>

        <div className="mt-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Pick up?
          </label>
          <div className="flex mt-3">
            <input
              type="radio"
              id="pick-up-true"
              name="pick-up"
              value="true"
              checked={shipping.pickUp === true}
              onChange={() => {
                setShipping({ ...shipping, pickUp: true })
              }}
              onBlur={changeData}
            />
            <label
              htmlFor="pick-up-true"
              className="ml-2 text-sm text-gray-700"
            >
              Yes
            </label>
          </div>
          <div className="flex mt-3">
            <input
              type="radio"
              id="pick-up-false"
              name="pick-up"
              value="false"
              checked={shipping.pickUp === false}
              onChange={() => {
                setShipping({ ...shipping, pickUp: false })
              }}
              onBlur={changeData}
            />
            <label
              htmlFor="pick-up-false"
              className="ml-2 text-sm text-gray-700"
            >
              No
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Shipping options</legend>
        <div className="mt-6">
          <label
            htmlFor="shipping-option"
            className="block text-sm font-medium text-gray-700"
          >
            Shipping options
          </label>

          <div className="flex mt-3">
            <input
              type="radio"
              id="shipping-option-courier"
              name="shipping-option"
              value="courier"
              checked={shipping.shippingOption === 'courier'}
              onChange={() => {
                setShipping({ ...shipping, shippingOption: 'courier' })
              }}
              onBlur={changeData}
            />
            <label
              htmlFor="shipping-option-courier"
              className="ml-2 text-sm text-gray-700"
            >
              Courier
            </label>
          </div>

          <div className="flex mt-3">
            <input
              type="radio"
              id="shipping-option-post"
              name="shipping-option"
              value="post"
              checked={shipping.shippingOption === 'post'}
              onChange={() => {
                setShipping({ ...shipping, shippingOption: 'post' })
              }}
              onBlur={changeData}
            />
            <label
              htmlFor="shipping-option-free"
              className="ml-2 text-sm text-gray-700"
            >
              Post
            </label>
          </div>
        </div>
      </fieldset>

      <div className="mt-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Start Listing
        </button>
      </div>
    </form>
  )
}
