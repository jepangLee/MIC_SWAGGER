import { ApiProperty } from '@nestjs/swagger';

export class RefreshRes {
  @ApiProperty()
  public accessToken: string;

  public constructor(prop: RefreshRes) {
    Object.assign(this, prop);
  }
}
