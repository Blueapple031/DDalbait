import React, { useState } from 'react';
import {
  Button,
  Input,
  XStack,
  YStack,
  Text,
  H2,
  Separator,
  Spinner,
} from 'tamagui';

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => Promise<void>;
  onModeChange: () => void;
  loading?: boolean;
  error?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  nickname?: string;
  confirmPassword?: string;
}

export function AuthForm({ 
  mode, 
  onSubmit, 
  onModeChange, 
  loading = false, 
  error 
}: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    nickname: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async () => {
    setValidationError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setValidationError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (mode === 'register') {
      if (!formData.nickname) {
        setValidationError('닉네임을 입력해주세요.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setValidationError('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (formData.password.length < 8) {
        setValidationError('비밀번호는 8자 이상이어야 합니다.');
        return;
      }
    }

    await onSubmit(formData);
  };

  const displayError = error || validationError;

  return (
    <YStack space="$4" maxWidth={400} width="100%">
      <YStack space="$2" alignItems="center">
        <H2 color="$color12">
          {mode === 'login' ? '로그인' : '회원가입'}
        </H2>
        <Text color="$color11" textAlign="center">
          {mode === 'login' 
            ? '농구 커뮤니티에 다시 오신 것을 환영합니다!' 
            : '농구 커뮤니티에 참여해보세요!'
          }
        </Text>
      </YStack>

      <YStack space="$3">
        <Input
          placeholder="이메일"
          value={formData.email}
          onChangeText={(email) => setFormData(prev => ({ ...prev, email }))}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          disabled={loading}
        />

        {mode === 'register' && (
          <Input
            placeholder="닉네임"
            value={formData.nickname}
            onChangeText={(nickname) => setFormData(prev => ({ ...prev, nickname }))}
            disabled={loading}
          />
        )}

        <Input
          placeholder="비밀번호"
          value={formData.password}
          onChangeText={(password) => setFormData(prev => ({ ...prev, password }))}
          secureTextEntry
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          disabled={loading}
        />

        {mode === 'register' && (
          <Input
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChangeText={(confirmPassword) => setFormData(prev => ({ ...prev, confirmPassword }))}
            secureTextEntry
            autoComplete="new-password"
            disabled={loading}
          />
        )}

        {displayError && (
          <Text color="$red10" fontSize="$3" textAlign="center">
            {displayError}
          </Text>
        )}

        <Button 
          onPress={handleSubmit}
          disabled={loading}
          theme="active"
          size="$4"
        >
          {loading ? (
            <XStack space="$2" alignItems="center">
              <Spinner size="small" color="$color" />
              <Text color="$color">
                {mode === 'login' ? '로그인 중...' : '가입 중...'}
              </Text>
            </XStack>
          ) : (
            mode === 'login' ? '로그인' : '회원가입'
          )}
        </Button>

        <Separator />

        <Button
          variant="outlined"
          onPress={onModeChange}
          disabled={loading}
        >
          {mode === 'login' 
            ? '계정이 없으신가요? 회원가입' 
            : '이미 계정이 있으신가요? 로그인'
          }
        </Button>
      </YStack>
    </YStack>
  );
} 