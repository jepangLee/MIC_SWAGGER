import { ApiProperty } from '@nestjs/swagger';
import { RefreshRes } from './refresh.res';

export class LogInRes extends RefreshRes {
  @ApiProperty()
  public refreshToken: string;

  public constructor(prop: LogInRes) {
    super({ accessToken: prop.accessToken });
    Object.assign(this, prop);
  }
}
