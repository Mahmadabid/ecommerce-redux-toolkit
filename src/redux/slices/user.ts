import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit/react";
import { AuthState, LoginRequest, LogOutResponse, UserResponse } from "./types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  }),
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => "/users",
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
        url: "/users",
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
    login: builder.mutation<UserResponse, LoginRequest>({
        query: (credentials) => ({
          url: "auth/login",
          method: "POST",
          body: credentials,
        }),
      }),
      logout: builder.mutation<LogOutResponse, void>({
        query: () => ({
          url: "auth/logout",
          method: "POST",
          validateStatus(response) {
            return response.ok === true;
          },
        }),
      }),
  }),
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
  } as AuthState,
  reducers: {
    refreshAuthentication: (state) => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (isAuthenticated === "true") {
        const userSession = localStorage.getItem("user");
        const response: UserResponse = JSON.parse(
          userSession as string
        ) as UserResponse;
        state.token = response.token;
        state.user = {
          username: response.username,
          id: response.userId,
          email: response.email,
          role: response.role,
        };
      }
      return state;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      usersApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
        };
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", `${JSON.stringify(payload)}`);
        return state;
      }
    );
    builder.addMatcher(usersApi.endpoints.logout.matchFulfilled, (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      return state;
    });
  },
});

export const { useFetchUsersQuery, useAddUserMutation } = usersApi;
export const { refreshAuthentication } = authSlice.actions;

const usersReducer = usersApi.reducer;
export default usersReducer;
