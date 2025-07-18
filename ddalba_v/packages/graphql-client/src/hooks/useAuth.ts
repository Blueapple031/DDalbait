import { useMutation, useQuery } from '@apollo/client';
import { LOGIN, REGISTER, LOGOUT, REFRESH_TOKEN } from '../mutations/auth';
import { GET_ME } from '../queries/auth';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  nickname: string;
}

export function useAuth() {
  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(GET_ME, {
    errorPolicy: 'ignore', // Ignore errors when user is not authenticated
  });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);

  const login = async (input: LoginInput) => {
    const result = await loginMutation({
      variables: { input },
    });
    
    if (result.data?.login) {
      // Store tokens in secure storage
      await storeTokens(result.data.login.accessToken, result.data.login.refreshToken);
      // Refetch user data
      await refetchMe();
    }
    
    return result;
  };

  const register = async (input: RegisterInput) => {
    const result = await registerMutation({
      variables: { input },
    });
    
    if (result.data?.register) {
      // Store tokens in secure storage
      await storeTokens(result.data.register.accessToken, result.data.register.refreshToken);
      // Refetch user data
      await refetchMe();
    }
    
    return result;
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } finally {
      // Clear tokens from storage
      await clearTokens();
      // Clear Apollo cache
      await refetchMe();
    }
  };

  const refreshToken = async (refreshTokenValue: string) => {
    const result = await refreshTokenMutation({
      variables: { refreshToken: refreshTokenValue },
    });
    
    if (result.data?.refreshToken) {
      await storeTokens(
        result.data.refreshToken.accessToken, 
        result.data.refreshToken.refreshToken
      );
    }
    
    return result;
  };

  return {
    user: meData?.me,
    isAuthenticated: !!meData?.me,
    loading: meLoading || loginLoading || registerLoading || logoutLoading,
    login,
    register,
    logout,
    refreshToken,
    refetchMe,
  };
}

// Token storage utilities (platform-specific implementation needed)
const storeTokens = async (accessToken: string, refreshToken: string) => {
  // Implementation will vary by platform (React Native vs Web)
  if (typeof window !== 'undefined') {
    // Web implementation
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    // React Native implementation would use SecureStore
    console.warn('Token storage not implemented for this platform');
  }
};

const clearTokens = async () => {
  if (typeof window !== 'undefined') {
    // Web implementation
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } else {
    // React Native implementation would use SecureStore
    console.warn('Token clearing not implemented for this platform');
  }
};

export const getStoredTokens = async () => {
  if (typeof window !== 'undefined') {
    // Web implementation
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  } else {
    // React Native implementation would use SecureStore
    return { accessToken: null, refreshToken: null };
  }
}; 