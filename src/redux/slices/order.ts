import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/createOrder",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["orders"],
    }),
    fetchOrders: builder.query({
      query: ({ orderId }) => {
        const query = new URLSearchParams();
        if (orderId) query.set("orderId", orderId);
        return `/orders/order?${query.toString()}`;
      },
    }),
    fetchPurchases: builder.query({
      query: () => '/orders/purchases'
    }),
    fetchSales: builder.query({
      query: () => '/orders/sales'
    }),
  }),
});

export const { useCreateOrderMutation, useFetchOrdersQuery, useFetchPurchasesQuery, useFetchSalesQuery } = orderApi;

const orderReducer = orderApi.reducer;
export default orderReducer;
