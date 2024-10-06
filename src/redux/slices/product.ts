import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  img: string;
}

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`}),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => 'products'
    }),
    getProductsBySeller: builder.query<Product[], string>({
      query: (seller) => `products?seller=${seller}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductsBySellerQuery } = productApi;

const productReducer = productApi.reducer;
export default productReducer;