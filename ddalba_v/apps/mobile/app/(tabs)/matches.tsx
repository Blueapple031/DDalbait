import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  YStack,
  XStack,
  H2,
  H4,
  Text,
  Button,
  Card,
  Spinner,
  Separator,
} from 'tamagui';
import { router } from 'expo-router';

// TODO: 실제 GraphQL 훅 연결 후 교체
// import { useMatches, useAuth } from '@hoops/graphql-client';

export default function MatchesScreen() {
  // TODO: 실제 인증 상태 확인
  const isAuthenticated = false;
  
  // TODO: 실제 데이터 연결
  const loading = false;
  const matches = [];
  const error = null;

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: 데이터 새로고침 로직
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCreateMatch = () => {
    // TODO: 경기 생성 화면으로 이동
    console.log('Create match');
  };

  const handleViewMatch = (matchId: string) => {
    // TODO: 경기 상세 화면으로 이동
    console.log('View match:', matchId);
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
            <Text fontSize="$6">🏀</Text>
            <H2 textAlign="center">로그인이 필요합니다</H2>
            <Text color="$color11" textAlign="center">
              경기 목록을 보려면 로그인해주세요.
            </Text>
          </YStack>

          <Button 
            onPress={() => router.push('/(auth)/login')}
            theme="active"
            size="$4"
          >
            로그인하기
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <YStack 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          space="$4"
        >
          <Spinner size="large" color="$orange10" />
          <Text color="$color11">경기 목록을 불러오는 중...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <YStack 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          space="$4" 
          padding="$4"
        >
          <Text fontSize="$6">⚠️</Text>
          <H2 textAlign="center" color="$red10">오류가 발생했습니다</H2>
          <Text color="$color11" textAlign="center">
            경기 목록을 불러올 수 없습니다.
          </Text>
          <Button onPress={handleRefresh} variant="outlined">
            다시 시도
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <YStack flex={1}>
        {/* Header */}
        <XStack 
          justifyContent="space-between" 
          alignItems="center" 
          padding="$4"
          backgroundColor="$background"
        >
          <H2>🏀 경기 목록</H2>
          <Button 
            onPress={handleCreateMatch}
            theme="active"
            size="$3"
            icon="+"
          >
            경기 등록
          </Button>
        </XStack>

        <Separator />

        {/* 필터 섹션 (추후 구현) */}
        <XStack 
          space="$2" 
          padding="$4" 
          backgroundColor="$background"
        >
          <Button variant="outlined" size="$2">
            전체
          </Button>
          <Button variant="outlined" size="$2">
            친선전
          </Button>
          <Button variant="outlined" size="$2">
            랭킹전
          </Button>
          <Button variant="outlined" size="$2">
            내 경기
          </Button>
        </XStack>

        {/* 경기 목록 */}
        {matches.length === 0 ? (
          <YStack 
            flex={1} 
            justifyContent="center" 
            alignItems="center" 
            space="$4" 
            padding="$4"
          >
            <Text fontSize="$6">🏀</Text>
            <H4 textAlign="center">등록된 경기가 없습니다</H4>
            <Text color="$color11" textAlign="center">
              첫 번째 경기를 등록해보세요!
            </Text>
            <Button 
              onPress={handleCreateMatch}
              theme="active"
              size="$4"
            >
              경기 등록하기
            </Button>
          </YStack>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item: any) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#FF6B35"
              />
            }
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <MatchCard 
                match={item} 
                onPress={() => handleViewMatch(item.id)} 
              />
            )}
            ItemSeparatorComponent={() => <YStack height="$3" />}
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}

// 경기 카드 컴포넌트 (추후 별도 파일로 분리 가능)
interface MatchCardProps {
  match: any; // TODO: 실제 Match 타입으로 변경
  onPress: () => void;
}

function MatchCard({ match, onPress }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '$orange10';
      case 'ACCEPTED': return '$green10';
      case 'IN_PROGRESS': return '$blue10';
      case 'COMPLETED': return '$gray10';
      case 'CANCELLED': return '$red10';
      default: return '$gray10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '매칭 대기';
      case 'ACCEPTED': return '매칭 완료';
      case 'IN_PROGRESS': return '진행 중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소됨';
      default: return status;
    }
  };

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      hoverTheme
      pressTheme
      onPress={onPress}
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} space="$2">
            <H4>{match.title}</H4>
            <Text color="$color11" fontSize="$3">
              📍 {match.location}
            </Text>
            <Text color="$color11" fontSize="$3">
              📅 {new Date(match.scheduledAt).toLocaleDateString('ko-KR')} 
              {' '}
              {new Date(match.scheduledAt).toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </YStack>
          
          <YStack alignItems="flex-end" space="$1">
            <Text 
              color={getStatusColor(match.status)} 
              fontSize="$2" 
              fontWeight="bold"
            >
              {getStatusText(match.status)}
            </Text>
            <Text color="$color10" fontSize="$2">
              {match.type === 'RANKING' ? '랭킹전' : '친선전'}
            </Text>
          </YStack>
        </XStack>
      </Card.Header>

      <Card.Footer padded>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2" alignItems="center">
            <Text fontSize="$3">👤 {match.host.nickname}</Text>
            {match.opponent && (
              <>
                <Text color="$color11">vs</Text>
                <Text fontSize="$3">👤 {match.opponent.nickname}</Text>
              </>
            )}
          </XStack>
          
          {match.status === 'COMPLETED' && match.hostScore !== undefined && (
            <Text fontSize="$3" fontWeight="bold">
              {match.hostScore} : {match.opponentScore || 0}
            </Text>
          )}
        </XStack>
      </Card.Footer>
    </Card>
  );
} 