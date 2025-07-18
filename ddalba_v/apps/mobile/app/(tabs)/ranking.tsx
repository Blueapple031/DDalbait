import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, H2 } from 'tamagui';

export default function RankingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <YStack space="$4" padding="$4">
        <H2>🏆 랭킹</H2>
        <Text>랭킹 시스템이 곧 추가됩니다!</Text>
      </YStack>
    </SafeAreaView>
  );
} 