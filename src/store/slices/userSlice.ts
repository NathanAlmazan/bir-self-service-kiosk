import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole, UserState } from '../types';

const initialState: UserState = {
  office: null,
  role: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ office: string; role: UserRole }>
    ) => {
      state.office = action.payload.office;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.office = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    updateOffice: (state, action: PayloadAction<string>) => {
      state.office = action.payload;
    },
    updateRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
  },
});

// Export actions
export const { setUser, clearUser, updateOffice, updateRole } = userSlice.actions;

export default userSlice.reducer;
