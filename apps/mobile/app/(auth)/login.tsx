import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  YStack,
  ScrollView,
  Button,
  Text,
  AuthForm,
  SocialLoginButtons,
  type AuthFormData,
} from '@hoops/ui';
import { useAuth, getErrorMessage } from '@hoops/graphql-client';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string>('');
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
      
      // Success - navigate to main app
      router.replace('/(tabs)');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Alert.alert(
          mode === 'login' ? '로그인 실패' : '회원가입 실패',
          errorMessage
        );
      }
    }
  };

  const handleModeChange = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    Alert.alert('구현 예정', 'Google 로그인 기능을 구현 중입니다.');
  };

  const handleKakaoLogin = () => {
    // TODO: Implement Kakao OAuth login
    Alert.alert('구현 예정', 'Kakao 로그인 기능을 구현 중입니다.');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          paddingHorizontal="$4"
          paddingVertical="$6"
          space="$6"
        >
          {/* Logo/Title Section */}
          <YStack space="$2" alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$orange10">
              🏀 Hoops
            </Text>
            <Text fontSize="$5" color="$color11" textAlign="center">
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

          {/* Skip Login Button for Development */}
          {__DEV__ && (
            <Button
              variant="outlined"
              onPress={() => router.replace('/(tabs)')}
              marginTop="$4"
            >
              개발용: 로그인 건너뛰기
            </Button>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
} 