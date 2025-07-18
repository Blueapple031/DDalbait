'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  YStack,
  XStack,
  H1,
  Text,
  Button,
  Card,
  AuthForm,
  SocialLoginButtons,
  type AuthFormData,
} from '@hoops/ui';
import { useAuth, getErrorMessage } from '@hoops/graphql-client';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { login, register, loading } = useAuth();

  const handleSubmit = async (data: AuthFormData) => {
    try {
      setError('');
      
      if (mode === 'login') {
        await login({
          email: data.email,
          password: data.password,
        });
      } else {
        await register({
          email: data.email,
          password: data.password,
          nickname: data.nickname!,
        });
      }
      
      // Success - redirect to home
      router.push('/');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  const handleModeChange = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    window.location.href = '/api/auth/google';
  };

  const handleKakaoLogin = () => {
    // TODO: Implement Kakao OAuth login
    window.location.href = '/api/auth/kakao';
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      minHeight="100vh"
      background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <Card
        elevate
        padding="$6"
        space="$4"
        width="100%"
        maxWidth={450}
        backgroundColor="$background"
      >
        {/* Header */}
        <YStack space="$3" alignItems="center">
          <XStack alignItems="center" space="$2">
            <Text fontSize="$8">🏀</Text>
            <H1 color="$orange10">Hoops</H1>
          </XStack>
          <Text color="$color11" textAlign="center" fontSize="$4">
            부산대 농구 커뮤니티
          </Text>
        </YStack>

        {/* Auth Form */}
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onModeChange={handleModeChange}
          loading={loading}
          error={error}
        />

        {/* Social Login */}
        <SocialLoginButtons
          onGoogleLogin={handleGoogleLogin}
          onKakaoLogin={handleKakaoLogin}
          loading={loading}
        />

        {/* Footer */}
        <YStack space="$2" alignItems="center" paddingTop="$4">
          <Text color="$color10" fontSize="$2" textAlign="center">
            로그인하면 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </Text>
          
          <XStack space="$4">
            <Button
              variant="ghost"
              size="$2"
              color="$color11"
              onPress={() => router.push('/')}
            >
              홈으로
            </Button>
            <Button
              variant="ghost"
              size="$2"
              color="$color11"
            >
              도움말
            </Button>
          </XStack>
        </YStack>

        {/* Dev Tools */}
        {process.env.NODE_ENV === 'development' && (
          <YStack space="$2" paddingTop="$4" borderTopWidth={1} borderTopColor="$borderColor">
            <Text fontSize="$2" color="$color10" textAlign="center">
              개발용 도구
            </Text>
            <Button
              variant="outlined"
              size="$3"
              onPress={() => router.push('/')}
            >
              로그인 건너뛰기
            </Button>
          </YStack>
        )}
      </Card>
    </YStack>
  );
} 