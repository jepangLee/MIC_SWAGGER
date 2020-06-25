import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserInReqClass } from '@app/type';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly authService: AuthService;

  public async validate(username: string, password: string): Promise<UserInReqClass> {
    return this.authService.validate(username, password);
  }
}
