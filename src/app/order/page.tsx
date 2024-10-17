"use client";

import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { useFetchOrdersQuery } from "@/redux/slices/order";
import { useSearchParams } from "next/navigation";
import { PRODUCT } from "../api/orders/order/route";
import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import { useState } from "react";
import Load from "@/components/utils/Load";
import { formatDate, handleRtkQueryError } from "@/components/utils/utils";

const Order = () => {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";

  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  const {
    data: order,
    error: orderFetchError,
    isFetching,
    isLoading,
  } = useFetchOrdersQuery(orderId && { orderId });

  if (orderId) {
    if (isLoading) return <PageLoad />;

    if (orderFetchError)
      return <PageError message={handleRtkQueryError(orderFetchError)} />;

   
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-h-color text-center">
          Order Summary
        </h1>

        {/* Shipping Details Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#214b66] mb-2">
            Shipping Details
          </h2>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-gray-700">
              <strong>Name:</strong> {order.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {order.email}
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> {order.address}
            </p>
            <p className="text-gray-700">
              <strong>City:</strong> {order.city}, {order.zipcode}
            </p>
            <p className="text-gray-700">
              <strong>Country:</strong> {order.country}
            </p>
            <p className="text-gray-700">
              <strong>Bought At:</strong> {formatDate(order.created_at)}
            </p>
          </div>
        </section>

        {/* Payment Details Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#214b66] mb-2">
            Payment Details
          </h2>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-gray-700">
              <strong>Cash on Delivery</strong>
            </p>
          </div>
        </section>

        {/* Items Purchased Section */}
        <section>
          <h2 className="text-xl font-semibold text-[#214b66] mb-2">
            Items Purchased
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-[#dbe1fe] text-h-color">
                  <th className="px-2 py-2 text-left">Item</th>
                  <th className="px-2 py-2">Seller</th>
                  <th className="px-2 py-2">Quantity</th>
                  <th className="px-2 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item: PRODUCT) => (
                  <tr key={item.productid} className="text-gray-700">
                    <td className="px-2 py-2">{item.productname}</td>
                    <td className="px-2 py-2 text-center">
                      {item.productseller}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {item.productquantity}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {item.productprice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  } else {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const foundOrder = order.find(
        (order: { id: string }) => order.id === searchId
      );
      if (foundOrder) {
        window.location.href = `/order?orderId=${searchId}`;
      } else {
        setError("Not found");
      }
    };

    if (isFetching) return <PageLoad />;
    if (orderFetchError)
      return <PageError message={handleRtkQueryError(orderFetchError)} />;

    return (
      <div className="flex justify-center items-center">
        <form
          className="px-2 flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold mt-9 mb-8 text-h-color text-center">
            Search Orders
          </h1>
          <FloatingLabelInput
            label="Enter Order Id"
            required
            value={searchId}
            onChange={setSearchId}
            classname="w-96"
          />
          <p className="text-red-500 font-medium my-2">{error}</p>
          <button
            type="submit"
            disabled={isFetching}
            className="button-style font-semibold px-3 py-2 rounded"
          >
            {isFetching ? <Load /> : "Search"}
          </button>
        </form>
      </div>
    );
  }
};

export default Order;
