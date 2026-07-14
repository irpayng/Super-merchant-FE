'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  resetEmail: string;
  otpVerified: boolean;
  tempOtp: string;
}

interface AuthContextType {
  state: AuthState;
  setState: (data: Partial<AuthState>) => void;
  resetState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setInternalState] = useState<AuthState>({
    token: null,
    resetEmail: '',
    otpVerified: false,
    tempOtp: '',
  });

  const setState = (data: Partial<AuthState>) => {
    setInternalState((prev) => ({ ...prev, ...data }));
  };

  const resetState = () => {
    setInternalState({
      token: null,
      resetEmail: '',
      otpVerified: false,
      tempOtp: '',
    });
  };

  return (
    <AuthContext.Provider value={{ state, setState, resetState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
