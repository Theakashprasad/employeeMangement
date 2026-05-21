import { authHttp } from "./http";
import type { AuthUser } from "./login.service";

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  success?: boolean;
  message?: string;
  Message?: string;
  _id?: string;
  user?: AuthUser;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export async function signUp(payload: SignUpPayload): Promise<AuthUser> {
  const { data } = await authHttp.post<SignUpResponse>("/signup", payload);

  if (!data.success && (data.message || data.Message)) {
    throw new Error(data.message ?? data.Message);
  }

  const user: AuthUser = {
    _id: String(data.user?._id ?? data._id ?? ""),
    email: data.user?.email ?? data.email,
    firstName: data.user?.firstName ?? data.firstName,
    lastName: data.user?.lastName ?? data.lastName,
  };

  if (!user._id) {
    throw new Error("Sign up failed. Please try again.");
  }

  return user;
}
