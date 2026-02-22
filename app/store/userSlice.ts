import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  avatar?: string;
  role?: string;
}

export interface UserProfile {
  id?: string;         
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// --- initial state ---
const initialState: UserState = {
  id: "user-001",
  name: "Madison Greg",
  email: "Madison.reertr@email.com",
  isAuthenticated: true,
};

// --- Redux slice ---
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

export function mapUserProfileToState(user: UserProfile): UserState {
  return {
    id: user.id ?? "user-unknown",      
    name: user.name ?? "",
    email: user.email ?? "",
    avatar: user.avatar,
    role: user.role,
    isAuthenticated: true,
  };
}

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;