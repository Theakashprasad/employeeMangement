import { authHttp } from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  existingUser?: AuthUser;
  Message?: string;
}

const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const USER_KEY = "user";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem("userDataId");
  localStorage.removeItem(USER_KEY);
}

export function saveAuthSession(response: LoginResponse): void {
  const jwt = response.accessToken ?? response.token;
  if (jwt) {
    localStorage.setItem(TOKEN_KEY, jwt);
  }
  const user = response.existingUser;
  if (user?._id) {
    localStorage.setItem(USER_ID_KEY, user._id);
    localStorage.setItem("userDataId", JSON.stringify(user._id));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await authHttp.post<LoginResponse>("/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await authHttp.post("/logout");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    clearAuthStorage();
  }
}
