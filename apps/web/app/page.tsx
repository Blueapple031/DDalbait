'use client';

import { useRouter } from 'next/navigation';
import { YStack, XStack, Card, H1, H2, H4, Button, Paragraph } from 'tamagui';
import { Home, Calendar, Trophy, Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  
  // TODO: 인증 상태 관리 연결
  const isAuthenticated = false;
  const user = null;

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 구현
    console.log('Logout');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#FF6B35', 
        color: 'white', 
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack space="$2">
              <H1 color="white">🏀 Hoops Platform</H1>
              <Paragraph color="white" size="$5">
                농구 경기를 함께 즐기는 커뮤니티
              </Paragraph>
            </YStack>
            
            {/* Auth Section */}
            <XStack space="$3" alignItems="center">
              {isAuthenticated ? (
                <>
                  <Paragraph color="white" size="$4">
                    환영합니다, {user?.nickname || '사용자'}님!
                  </Paragraph>
                  <Button
                    variant="outlined"
                    onPress={handleLogout}
                    borderColor="white"
                    color="white"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <XStack space="$2">
                  <Button
                    variant="outlined"
                    onPress={handleLogin}
                    borderColor="white"
                    color="white"
                  >
                    로그인
                  </Button>
                  <Button
                    onPress={handleLogin}
                    backgroundColor="white"
                    color="$orange10"
                  >
                    회원가입
                  </Button>
                </XStack>
              )}
            </XStack>
          </XStack>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Hero Section */}
        <YStack space="$6" alignItems="center" paddingVertical="$8">
          <YStack space="$4" alignItems="center" maxWidth={600}>
            <H1 textAlign="center" size="$10">
              부산대 농구 커뮤니티의 중심
            </H1>
            <Paragraph textAlign="center" size="$6" color="$gray11">
              경기를 등록하고, 통계를 확인하며, 함께 성장하는 농구 커뮤니티에 참여하세요.
            </Paragraph>
            
            {!isAuthenticated && (
              <XStack space="$3" paddingTop="$4">
                <Button 
                  size="$5" 
                  theme="active"
                  onPress={handleLogin}
                >
                  지금 시작하기
                </Button>
                <Button 
                  size="$5" 
                  variant="outlined"
                  onPress={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                >
                  더 알아보기
                </Button>
              </XStack>
            )}
          </YStack>
        </YStack>

        {/* Features Grid */}
        <YStack space="$6" paddingVertical="$6">
          <H2 textAlign="center">주요 기능</H2>
          
          <XStack space="$4" justifyContent="space-between" flexWrap="wrap">
            <Card flex={1} minWidth={250} padding="$4" space="$3">
              <Calendar size={48} color="#FF6B35" />
              <H4>경기 일정 관리</H4>
              <Paragraph color="$gray11">
                경기를 등록하고 팀원들과 일정을 공유하세요. 
                캘린더 동기화로 놓치는 경기가 없습니다.
              </Paragraph>
            </Card>
            
            <Card flex={1} minWidth={250} padding="$4" space="$3">
              <Trophy size={48} color="#FF6B35" />
              <H4>랭킹 & 통계</H4>
              <Paragraph color="$gray11">
                개인 기록과 팀 성과를 추적하고 랭킹을 확인하세요. 
                데이터로 보는 성장의 기록입니다.
              </Paragraph>
            </Card>
            
            <Card flex={1} minWidth={250} padding="$4" space="$3">
              <Users size={48} color="#FF6B35" />
              <H4>커뮤니티</H4>
              <Paragraph color="$gray11">
                농구를 사랑하는 사람들과 소통하고 
                함께 성장하는 커뮤니티를 만들어가세요.
              </Paragraph>
            </Card>
          </XStack>
        </YStack>

        {/* CTA Section */}
        {!isAuthenticated && (
          <YStack 
            space="$4" 
            alignItems="center" 
            padding="$6" 
            backgroundColor="$orange2" 
            borderRadius="$4"
            marginVertical="$6"
          >
            <H2 textAlign="center">지금 바로 시작하세요!</H2>
            <Paragraph textAlign="center" color="$gray11">
              무료로 가입하고 부산대 농구 커뮤니티의 일원이 되어보세요.
            </Paragraph>
            <Button 
              size="$5" 
              theme="active"
              onPress={handleLogin}
            >
              회원가입 하기
            </Button>
          </YStack>
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#2D3748', 
        color: 'white', 
        padding: '2rem 0',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <XStack justifyContent="space-between" alignItems="center">
            <Paragraph color="$gray10">
              © 2024 Hoops Platform. All rights reserved.
            </Paragraph>
            <XStack space="$4">
              <Button variant="ghost" color="$gray10" size="$3">
                이용약관
              </Button>
              <Button variant="ghost" color="$gray10" size="$3">
                개인정보처리방침
              </Button>
              <Button variant="ghost" color="$gray10" size="$3">
                문의하기
              </Button>
            </XStack>
          </XStack>
        </div>
      </footer>
    </div>
  );
} 