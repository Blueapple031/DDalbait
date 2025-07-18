import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserRole } from '@common/enums/role.enum';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      logoutAllDevices: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('회원가입 뮤테이션이 성공해야 함', async () => {
      const registerInput = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        username: 'testuser',
        fullName: 'Test User',
      };

      const expectedResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: new User(),
        expiresIn: 900,
      };

      authService.register = jest.fn().mockResolvedValue(expectedResult);

      const result = await resolver.register(registerInput);

      expect(authService.register).toHaveBeenCalledWith(registerInput);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('로그인 뮤테이션이 성공해야 함', async () => {
      const loginInput = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const expectedResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: new User(),
        expiresIn: 900,
      };

      authService.login = jest.fn().mockResolvedValue(expectedResult);

      const result = await resolver.login(loginInput);

      expect(authService.login).toHaveBeenCalledWith(loginInput);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('me', () => {
    it('현재 사용자 정보를 반환해야 함', async () => {
      const user = new User();
      user.email = 'test@example.com';
      user.role = UserRole.USER;

      const result = await resolver.me(user);

      expect(result).toBe(user);
    });
  });

  describe('refreshToken', () => {
    it('토큰 갱신이 성공해야 함', async () => {
      const refreshTokenValue = 'refresh-token-value';
      const expectedResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 900,
      };

      authService.refreshToken = jest.fn().mockResolvedValue(expectedResult);

      const result = await resolver.refreshToken(refreshTokenValue);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenValue);
      expect(result).toEqual(expectedResult);
    });
  });
}); 