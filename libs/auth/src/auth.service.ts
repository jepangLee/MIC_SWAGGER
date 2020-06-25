import { config } from '@app/config';
import { UserInReqClass } from '@app/type';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { EnumTokenType } from './enum/token-type.enum';
import { User } from '@app/entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService;
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  public createToken(id: number, type: EnumTokenType): string {
    return this.jwtService.sign({ id }, {
      expiresIn: type === EnumTokenType.access ? '30 min' : '14 days',
    });
  }

  public encode(content: string): string {
    return createHash(config.ENCRYPTION).update(content).digest('base64');
  }

  public async validate(username: string, password: string): Promise<UserInReqClass> {
    const user: User = await this.userRepo.findOne({ password: this.encode(password), username });
    if (!user) {
      return null;
    }
    return { id: user.id };
  }

  // only use in test

  public parseToken(token: string): UserInReqClass {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
