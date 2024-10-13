import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState, UserResponse } from "./types";

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
    updateUser: builder.mutation({
      query: ({
        password,
        zipcode,
        country,
        city,
        role,
        name,
        address,
      }) => ({
        url: "/auth/updateUser",
        method: "POST",
        body: {
          password,
          zipcode,
          country,
          city,
          role,
          name,
          address,
        },
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ id, adminId }) => ({
        url: "/auth/deleteUser",
        method: "DELETE",
        body: {
          id,
          adminId
        },
      }),
    }),
  }),
});

export const {
  useFetchCredentialsQuery,
  useAddUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApi;

const usersReducer = usersApi.reducer;
export default usersReducer;

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: true
  } as AuthState,
  reducers: {
    refreshAuthentication: (state) => {
      const userSession = localStorage.getItem("user");
      if (userSession) {
        const response: UserResponse = JSON.parse(
          userSession as string
        ) as UserResponse;
        state.token = response.token;
        state.user = {
          username: response.username,
          id: response.id,
          email: response.email,
          role: response.role,
          name: response.name,
          city: response.city,
          country: response.country,
          zipcode: response.zipcode,
          address: response.address,
          ok: response.ok,
        };
        state.loading = false;
      }
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      usersApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          name: payload.name,
          city: payload.city,
          country: payload.country,
          zipcode: payload.zipcode,
          address: payload.address,
          ok: payload.ok,
        };
        localStorage.setItem("user", `${JSON.stringify(payload)}`);
        return state;
      }
    );
    builder.addMatcher(
      usersApi.endpoints.updateUser.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          name: payload.name,
          city: payload.city,
          country: payload.country,
          zipcode: payload.zipcode,
          address: payload.address,
          ok: payload.ok,
        };
        localStorage.setItem("user", `${JSON.stringify(payload)}`);
        return state;
      }
    );
  },
});

export const { refreshAuthentication } = authSlice.actions;
