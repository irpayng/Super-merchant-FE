const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

interface LoginResponse {
  data: {
    token: string;
    email_is_verified: boolean;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  code: number;
  message: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

export async function forgotPassword(email: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

interface ResetPasswordPayload {
  otp: string;
  newPassword?: string;
  password_confirmation?: string;
  email: string;
}

export async function resetPassword({
  otp,
  newPassword,
  password_confirmation,
  email,
}: ResetPasswordPayload): Promise<ResetPasswordPayload> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ otp, newPassword, password_confirmation, email }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

export async function verifyOtp({
  otp,
  email,
}: ResetPasswordPayload): Promise<ResetPasswordPayload> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ otp, email }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}
