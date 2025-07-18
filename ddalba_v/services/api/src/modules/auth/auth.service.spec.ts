import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@mikro-orm/nestjs';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserRole } from '@common/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let refreshTokenRepository: any;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    };

    const mockRefreshTokenRepository = {
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
      find: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('register', () => {
    const registerInput = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      username: 'testuser',
      fullName: 'Test User',
    };

    it('이메일이 중복되면 ConflictException을 발생시켜야 함', async () => {
      const existingUser = new User();
      userRepository.findOne.mockResolvedValueOnce(existingUser);

      await expect(service.register(registerInput)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: registerInput.email,
      });
    });

    it('사용자명이 중복되면 ConflictException을 발생시켜야 함', async () => {
      userRepository.findOne
        .mockResolvedValueOnce(null) // 이메일 중복 검사
        .mockResolvedValueOnce(new User()); // 사용자명 중복 검사

      await expect(service.register(registerInput)).rejects.toThrow(
        ConflictException,
      );
    });

    it('정상적인 회원가입이 성공해야 함', async () => {
      userRepository.findOne.mockResolvedValue(null);
      configService.get.mockReturnValue('15m');
      jwtService.sign.mockReturnValue('mocked-jwt-token');

      const result = await service.register(registerInput);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('expiresIn');
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'TestPassword123!',
    };

    it('존재하지 않는 사용자로 로그인 시 UnauthorizedException을 발생시켜야 함', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('비밀번호가 틀리면 UnauthorizedException을 발생시켜야 함', async () => {
      const user = new User();
      user.password = 'hashed-password';
      userRepository.findOne.mockResolvedValue(user);

      // bcrypt.compare가 false를 반환하도록 모킹
      jest.doMock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(false),
      }));

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('비활성화된 계정으로 로그인 시 UnauthorizedException을 발생시켜야 함', async () => {
      const user = new User();
      user.password = 'hashed-password';
      user.isActive = false;
      userRepository.findOne.mockResolvedValue(user);

      jest.doMock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(true),
      }));

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('활성화된 사용자를 반환해야 함', async () => {
      const user = new User();
      user.id = 'user_123';
      user.isActive = true;
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser('user_123');

      expect(result).toBe(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        id: 'user_123',
        isActive: true,
      });
    });

    it('존재하지 않는 사용자는 null을 반환해야 함', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent');

      expect(result).toBeNull();
    });
  });
}); 