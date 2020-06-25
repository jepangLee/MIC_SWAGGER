import { User } from '@app/entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoadRes {
  @ApiProperty()
  public createDate: Date;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public username: string;

  public constructor(prop: User) {
    const userTmp: User = { ...prop };
    ['id', 'password'].forEach((e: string) => Reflect.deleteProperty(userTmp, e));
    Object.assign(this, userTmp);
  }
}
