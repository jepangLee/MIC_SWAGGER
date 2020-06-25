import { Inject, Injectable } from '@nestjs/common';
import { LoadRes, LogInRes, RefreshRes, SignUpDto } from '@app/type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entity';
import { Repository } from 'typeorm';
import { AuthService, EnumTokenType } from '@app/auth';

@Injectable()
export class UserService {
  @Inject()
  private readonly authService: AuthService;
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  public logIn(id: number): LogInRes {
    return new LogInRes({
      accessToken: this.authService.createToken(id, EnumTokenType.access),
      refreshToken: this.authService.createToken(id, EnumTokenType.refresh),
    });
  }

  public async load(id: number): Promise<LoadRes> {
    const user: User = await this.userRepo.findOne(id);
    return new LoadRes(user);
  }

  public refresh(id: number): RefreshRes {
    return new RefreshRes({ accessToken: this.authService.createToken(id, EnumTokenType.access) });
  }

  public async signUp(payload: SignUpDto): Promise<void> {
    const user: User = new User({ ...payload, password: this.authService.encode(payload.password) });
    await this.userRepo.insert(user);
  }


  public async withdrawal(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
