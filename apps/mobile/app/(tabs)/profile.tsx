import { Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  YStack,
  XStack,
  H2,
  Text,
  Button,
  Separator,
  ScrollView,
} from 'tamagui';

export default function ProfileScreen() {
  // TODO: 인증 상태 관리 연결
  const isAuthenticated = false;

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다.');
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <YStack 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          space="$4" 
          padding="$4"
        >
          <YStack space="$2" alignItems="center">
            <Text fontSize="$6">🔐</Text>
            <H2 textAlign="center">로그인이 필요합니다</H2>
            <Text color="$color11" textAlign="center">
              농구 커뮤니티의 모든 기능을 이용하려면{'\n'}
              로그인해주세요.
            </Text>
          </YStack>

          <YStack space="$3" width="100%" maxWidth={300}>
            <Button 
              onPress={handleLogin}
              theme="active"
              size="$4"
            >
              로그인 / 회원가입
            </Button>
            
            <Text color="$color10" fontSize="$2" textAlign="center">
              로그인하면 경기 기록, 랭킹 조회 등{'\n'}
              모든 기능을 이용할 수 있습니다.
            </Text>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  // 로그인된 상태 (추후 구현)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <ScrollView>
        <YStack space="$4" padding="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <H2>👤 프로필</H2>
            <Button
              variant="outlined"
              size="$3"
              onPress={handleLogout}
            >
              로그아웃
            </Button>
          </XStack>

          <Text>프로필 기능이 곧 구현됩니다!</Text>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
} 