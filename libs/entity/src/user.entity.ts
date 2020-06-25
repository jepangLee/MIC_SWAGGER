import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SignUpDto } from '@app/type';

@Entity()
export class User extends BaseEntity {
  @Column()
  public email: string;
  @Column()
  public password: string;
  @Column()
  public username: string;

  public constructor(prop: SignUpDto) {
    super();
    Object.assign(this, prop);
  }
}
