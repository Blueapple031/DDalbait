import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  Enum,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@common/enums/role.enum';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '사용자 역할',
});

@ObjectType('User')
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryKey()
  id!: string;

  @Field()
  @Property()
  @Unique()
  email!: string;

  @Property({ hidden: true }) // GraphQL에서 숨김
  password?: string;

  @Field()
  @Property()
  username!: string;

  @Field()
  @Property()
  fullName!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  profileImage?: string;

  @Field(() => UserRole)
  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @Field()
  @Property()
  isActive: boolean = true;

  @Field()
  @Property()
  isEmailVerified: boolean = false;

  @Field({ nullable: true })
  @Property({ nullable: true })
  emailVerificationToken?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  resetPasswordToken?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  resetPasswordExpires?: Date;

  // OAuth 관련 필드
  @Field({ nullable: true })
  @Property({ nullable: true })
  googleId?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  kakaoId?: string;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field({ nullable: true })
  @Property({ nullable: true })
  lastLoginAt?: Date;

  constructor() {
    this.id = this.generateId();
  }

  @BeforeCreate()
  @BeforeUpdate()
  updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Helper methods
  public updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  public isReferee(): boolean {
    return this.role === UserRole.REFEREE;
  }

  public canModerate(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.REFEREE;
  }
} 