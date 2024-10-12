import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductProps } from "./types";

export const productApi = createApi({
  reducerPath: "productApi",
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
  endpoints: (builder) => ({
    getProducts: builder.query<ProductProps[], void>({
      query: () => "products/fetch",
    }),
    getProductsBySeller: builder.query<ProductProps[], string>({
      query: (seller) => `products/fetch?seller=${seller}`,
    }),
    addProducts: builder.mutation({
      query: ({ seller, img, name, quantity, price, userId }) => ({
        url: "/products/addProducts",
        method: "POST",
        body: {
          seller,
          img,
          name,
          quantity,
          price,
          userId,
        },
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ productId }) => ({
        url: "/products/deleteProduct",
        method: "DELETE",
        body: {
          productId
        },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductsBySellerQuery, useAddProductsMutation, useDeleteProductMutation } = productApi;

const productReducer = productApi.reducer;
export default productReducer;
