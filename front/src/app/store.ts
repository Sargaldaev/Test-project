import { configureStore } from "@reduxjs/toolkit";
import {UsersReducer} from '../store/UsersSlice.ts';

export const store = configureStore({
  reducer: {
    users: UsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
