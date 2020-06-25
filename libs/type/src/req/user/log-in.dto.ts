import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogInDto {
  @ApiProperty()
  @IsString()
  public password: string;

  @ApiProperty()
  @IsString()
  public username: string;
}
