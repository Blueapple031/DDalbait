import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  BeforeCreate,
} from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryKey()
  id!: string;

  @Property()
  token!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  expiresAt!: Date;

  @Property()
  isRevoked: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  revokedAt?: Date;

  @Property({ nullable: true })
  deviceInfo?: string; // User-Agent, IP 등

  constructor() {
    this.id = this.generateId();
  }

  @BeforeCreate()
  setDefaults(): void {
    if (!this.expiresAt) {
      // 7일 후 만료
      this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  private generateId(): string {
    return 'rt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public revoke(): void {
    this.isRevoked = true;
    this.revokedAt = new Date();
  }

  public isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }
} 