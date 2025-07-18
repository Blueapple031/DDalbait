import React from 'react';
import {
  Button,
  XStack,
  YStack,
  Text,
  Separator,
} from 'tamagui';

export interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onKakaoLogin: () => void;
  loading?: boolean;
  showSeparator?: boolean;
}

export function SocialLoginButtons({ 
  onGoogleLogin, 
  onKakaoLogin, 
  loading = false,
  showSeparator = true 
}: SocialLoginButtonsProps) {
  return (
    <YStack space="$3" width="100%">
      {showSeparator && (
        <XStack space="$3" alignItems="center">
          <Separator flex={1} />
          <Text color="$color11" fontSize="$3">또는</Text>
          <Separator flex={1} />
        </XStack>
      )}

      <YStack space="$2">
        <Button
          onPress={onGoogleLogin}
          disabled={loading}
          backgroundColor="$white"
          borderColor="$gray8"
          borderWidth={1}
          color="$gray12"
          size="$4"
          icon="🔍" // Google icon placeholder
        >
          Google로 계속하기
        </Button>

        <Button
          onPress={onKakaoLogin}
          disabled={loading}
          backgroundColor="#FEE500"
          color="$black"
          size="$4"
          icon="💬" // Kakao icon placeholder
        >
          카카오로 계속하기
        </Button>
      </YStack>

      {showSeparator && (
        <Text color="$color10" fontSize="$2" textAlign="center" paddingTop="$2">
          소셜 로그인으로 간편하게 시작하세요
        </Text>
      )}
    </YStack>
  );
} 