import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ProductProps } from './types';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`}),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductProps[], void>({
      query: () => 'products'
    }),
    getProductsBySeller: builder.query<ProductProps[], string>({
      query: (seller) => `products?seller=${seller}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductsBySellerQuery } = productApi;

const productReducer = productApi.reducer;
export default productReducer;