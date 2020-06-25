import { config } from '@app/config';
import { entities } from '@app/entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  exports: [AuthService],
  imports: [
    JwtModule.register({ secret: config.JWT_SECRET }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {
}
