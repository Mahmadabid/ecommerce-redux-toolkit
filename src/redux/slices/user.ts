import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
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
    fetchCredentials: builder.query({
      query: () => "/fetchcredentials",
    }),
    addUser: builder.mutation({
      query: ({
        username,
        email,
        id,
        password,
        role,
        name,
        city,
        zipcode,
        address,
        country,
      }) => ({
        url: "/auth/addUser",
        method: "POST",
        body: {
          username,
          email,
          password,
          role,
          id,
          name,
          city,
          zipcode,
          address,
          country,
        },
      }),
    }),
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
  }),
});

export const { useFetchCredentialsQuery, useAddUserMutation, useLoginUserMutation } = usersApi;

const usersReducer = usersApi.reducer;
export default usersReducer;
