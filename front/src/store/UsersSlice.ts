import {createSlice} from '@reduxjs/toolkit';
import {User} from '../../types';
import {searchUser} from './UsersThunk.ts';

interface UsersState {
  user: User | null;
  fetchLoad: boolean;
}

const initialState: UsersState = {
  user: null,
  fetchLoad: false
};

export const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchUser.pending, (state: UsersState) => {
      state.fetchLoad = true;
      state.user = null;
    });
    builder.addCase(searchUser.fulfilled, (state: UsersState, action) => {
      state.fetchLoad = false;
      state.user = action.payload;

    });
    builder.addCase(searchUser.rejected, (state: UsersState, action) => {
      if (action.payload?.status !== 499) {
        state.fetchLoad = false;
      }
      state.user = null;
    });
  },
});

export const UsersReducer = UsersSlice.reducer;
