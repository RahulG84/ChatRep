import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch2 } from "../helper/fetch2";

const initialState = {
  token: "",
  loading: false,
  error: "",
  firstName: ""
};

export const signupUser = createAsyncThunk("signupuser", async (body) => {
  const result = await fetch2("/signup", body);
  return result;
});
export const signinUser = createAsyncThunk("signinuser", async (body) => {
  const result = await fetch2("/signin", body);
  return result;
});

const authReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = localStorage.getItem("token");
    },
    logout: (state, action) => {
      state.token = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.error) {
        state.error = action.payload.error;
      } else {
        state.error = action.payload.message;
      }
    },
    [signupUser.pending]: (state, action) => {
      state.loading = true;
    },
    [signinUser.pending]: (state, action) => {
      state.loading = true;
    },
    [signinUser.fulfilled]: (
      state,
      { payload: { error, token, firstName } }
    ) => {
      state.loading = false;
      if (error) {
        state.error = error;
      } else {
        state.token = token;
        state.firstName = firstName;
        localStorage.setItem("token", token);
      }
    }
  }
});

export const { addToken, logout } = authReducer.actions;

export default authReducer.reducer;
