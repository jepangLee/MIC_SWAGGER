import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { AuthModule, AuthService } from '@app/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@app/config';
import { entities } from '@app/entity';
import { RefreshRes, SignUpDto, UserInReqClass } from '@app/type';
import { TestUtilModule, TestUtilService } from '@app/test-util';
import { getConnection } from 'typeorm';

describe('userService', () => {
  let authService: AuthService;
  const testUser: SignUpDto = {
    email: 'test@test.com',
    password: 'test',
    username: 'test',
  };
  let testUserId: number;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule, TestUtilModule,
        TypeOrmModule.forRoot(config.ormConfig),
        TypeOrmModule.forFeature(entities),
        UserModule,
      ],
      providers: [UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    await userService.signUp(testUser);
    ({ id: testUserId } = await authService.validate(testUser.username, testUser.password));
  });

  afterAll(async () => {
    await userService.withdrawal(testUserId);
    await getConnection().close();
  });

  it('Should success refresh()', async () => {
    const { accessToken }: RefreshRes = userService.refresh(testUserId);
    expect(accessToken).toBeDefined();

    const { id }: UserInReqClass = authService.parseToken(accessToken);
    expect(id).toEqual(testUserId);
  });

  it('Should success load()', async () => {
    const [reqUser, resUser] = TestUtilService
      .makeElementComparable(testUser, await userService.load(testUserId), ['password', 'createDate']);
    expect(reqUser).toEqual(resUser);
  });
});
