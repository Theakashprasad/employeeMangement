import { create } from "zustand";
import {
  login as loginApi,
  logout as logoutApi,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
  clearAuthStorage,
  type AuthUser,
  type LoginPayload,
} from "@/services/login.service";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: Boolean(getStoredToken()),
  login: async (payload: LoginPayload) => {
    const response = await loginApi(payload);
    saveAuthSession(response);
    const token = response.accessToken ?? response.token ?? getStoredToken();
    const user = response.existingUser ?? getStoredUser();
    set({
      token,
      user,
      isAuthenticated: Boolean(token),
    });
  },
  logout: async () => {
    await logoutApi();
    clearAuthStorage();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
