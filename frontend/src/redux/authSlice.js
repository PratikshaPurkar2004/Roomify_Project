import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// LOGIN THUNK

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Save user object and userId for other pages (preferences)
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user && res.data.user.user_id) {
        localStorage.setItem("userId", String(res.data.user.user_id));
      }

      return res.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


// REGISTER THUNK
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      // If backend returned the new user id, store it so preferences page can use it
      if (res.data.userId) {
        localStorage.setItem("userId", String(res.data.userId));
      }
      // Also store the returned user object if present
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);


// FORGOT PASSWORD THUNK
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link"
      );
    }
  }
);


// RESET PASSWORD THUNK
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset password failed"
      );
    }
  }
);



// SINGLE SLICE
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    success: false,
    message: null
  },

  reducers: {
    clearMessage: (state) => {
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },

  extraReducers: (builder) => {

    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
         state.message = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })

      // .addCase(loginUser.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      .addCase(loginUser.rejected, (state, action) => {
        console.log("LOGIN ERROR:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.resetToken = action.payload.token;

      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { clearMessage } = authSlice.actions;

export default authSlice.reducer;
