const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SignupBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface LoginBody {
  email?: string;
  password?: string;
}

export function validateSignup(body: SignupBody): string | null {
  if (!body.firstName?.trim()) return "First name is required";
  if (!body.lastName?.trim()) return "Last name is required";
  if (!body.email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(body.email.trim())) return "Invalid email address";
  if (!body.password) return "Password is required";
  if (body.password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateLogin(body: LoginBody): string | null {
  if (!body.email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(body.email.trim())) return "Invalid email address";
  if (!body.password) return "Password is required";
  return null;
}

export function sanitizeUser(user: Record<string, unknown>) {
  const { password, __v, ...safe } = user;
  return {
    ...safe,
    _id: String(safe._id ?? ""),
  };
}
