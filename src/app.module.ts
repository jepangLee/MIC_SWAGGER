import { config } from '@app/config';
import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.ormConfig),
    UserModule,
  ],
})
export class AppModule {
}
