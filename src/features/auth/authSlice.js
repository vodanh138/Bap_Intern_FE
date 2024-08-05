import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import authService from '../../services/auth.service';
import tokenService from '../../services/token.service';

const user = tokenService.getUser();

const initialState = user
  ? {
      isLoggedIn: true,
      user,
      error: '',
      backupUI: false
    }
  : {
      isLoggedIn: false,
      user: null,
      error: '',
      backupUI: false
    };

export const loginAsync = createAsyncThunk(
  '/auth/login',
  async (userCredentials, thunkApi) => {
    try {
      const response = await authService.login(
        userCredentials.username,
        userCredentials.password
      );
      if (response.status === 'success') {
        return response;
      }
      return thunkApi.rejectWithValue(response.message || 'Login failed!');
    } catch (_error) {
      const error = _error;
      if (axios.isAxiosError(error)) {
        thunkApi.dispatch(setError(error.response?.data.message));
        thunkApi.dispatch(showBackupUI());
        return thunkApi.rejectWithValue(error.response?.data.message);
      }
      thunkApi.dispatch(setError(error.message));
      thunkApi.dispatch(showBackupUI());
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk('/logout', async () => {
  authService.logout();
  tokenService.removeUser();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    showBackupUI: (state) => {
      state.backupUI = true;
    },
    hideBackupUI: (state) => {
      state.backupUI = false;
    },
    refreshToken: (state, { payload }) => {
      state.user.accessToken = payload.accessToken;
      state.user.refreshToken = payload.refreshToken;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.user = payload.data;
        state.error = '';
        state.backupUI = false;
        tokenService.setUser(payload.data);
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoggedIn = false;
        state.error = 'Login failed!';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = '';
        state.backupUI = false;
      });
  }
});

export const { setError, showBackupUI, hideBackupUI, refreshToken } =
  authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
