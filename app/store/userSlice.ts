import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: "user-001",
  name: "Madison Greg",
  email: "Madison.reertr@email.com",
  isAuthenticated: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...action.payload, isAuthenticated: true };
    },
    clearUser: () => ({
      id: "",
      name: "",
      email: "",
      isAuthenticated: false,
    }),
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;