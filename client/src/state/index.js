import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  businesses: [],
  queues: [],
  queue: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const { user, business, token } = action.payload;

      // Clear both user and business in case of a new login
      state.user = null;
      state.business = null;
    
      // Determine the type of the logged-in entity (user or business)
      if (user) {
        state.user = user;
      } else if (business) {
        state.business = business;
      }
    
      // Set the token in the state
      state.token = token;
    },
    setLogout: (state) => {
      state.user = null;
      state.business = null;
      state.token = null;
    },
    setQueues: (state, action) => {
      state.queues = action.payload.queues;
    },
    setQueue: (state, action) => {
      state.queue = action.payload.queue;
    },
    setBusinesses: (state, action) => {
      state.businesses = action.payload.businesses
    }
  },
});

export const { setMode, setLogin, setLogout, setQueues, setQueue, setBusinesses } =
  authSlice.actions;
export default authSlice.reducer;
