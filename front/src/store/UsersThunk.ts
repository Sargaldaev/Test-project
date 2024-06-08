import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
import {User, UserPost} from '../../types';
import {isAxiosError} from 'axios';

export const searchUser = createAsyncThunk<User, UserPost, { rejectValue: { status: number } }>(
  'users/searchUser',
  async (arg, {rejectWithValue}) => {
    try {
      const {data} = await axiosApi.post<User>('users', arg);

      return data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 499) {
        return rejectWithValue({status: e.response.status});
      }
      throw e;
    }
  }
);