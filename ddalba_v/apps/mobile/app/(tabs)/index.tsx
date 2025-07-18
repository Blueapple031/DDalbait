import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Card, H2, H4, Button } from 'tamagui';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <ScrollView>
        <YStack space="$4" padding="$4">
          <YStack space="$2">
            <H2 color="$gray12">🏀 Hoops Platform</H2>
            <Text style={{ fontSize: 16, color: '#6B7280' }}>
              농구 경기를 함께 즐기는 커뮤니티
            </Text>
          </YStack>

          <Card elevate size="$4" bordered>
            <Card.Header padded>
              <H4>오늘의 경기</H4>
            </Card.Header>
            <Card.Footer padded>
              <XStack space="$2">
                <Button flex={1} theme="orange">
                  경기 등록
                </Button>
                <Button flex={1} variant="outlined">
                  경기 찾기
                </Button>
              </XStack>
            </Card.Footer>
          </Card>

          <Card elevate size="$4" bordered>
            <Card.Header padded>
              <H4>주간 랭킹</H4>
            </Card.Header>
            <Card.Footer padded>
              <Text>곧 업데이트 예정...</Text>
            </Card.Footer>
          </Card>

          <Card elevate size="$4" bordered>
            <Card.Header padded>
              <H4>최근 활동</H4>
            </Card.Header>
            <Card.Footer padded>
              <Text>최근 활동이 없습니다</Text>
            </Card.Footer>
          </Card>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
} 