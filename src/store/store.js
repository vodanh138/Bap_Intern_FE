import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import templatesReducer from '../features/dashboard/templatesSlice';
import setupInterceptors from '../services/setupInterceptors';
import sectionReducer from '../features/configPage/sectionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templatesReducer,
    section: sectionReducer
  }
});

setupInterceptors(store);
