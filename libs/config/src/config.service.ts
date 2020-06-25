import { entities } from '@app/entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IsEnum, IsNumberString, IsOptional, IsString, validateSync } from 'class-validator';
import { ValidationError } from 'class-validator/validation/ValidationError';
import { randomBytes } from 'crypto';
import { DotenvParseOutput, parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { NodeEnv } from './enum/node-env.enum';

export type Config = Record<string, string>;

@Injectable()
export class ConfigService {
  @IsString()
  public readonly ENCRYPTION: string;
  @IsString() @IsOptional()
  public readonly HOST?: string;
  @IsString() @IsOptional()
  public readonly JWT_SECRET?: string = randomBytes(16).toString();
  @IsString()
  public readonly DB_URL: string;
  @IsString()
  public readonly DB_TYPE: 'mysql' | 'mariadb' = 'mysql';
  @IsEnum(NodeEnv)
  public readonly NODE_ENV: NodeEnv;
  @IsNumberString() @IsOptional()
  public readonly PORT?: string = '3000';
  public readonly ormConfig: TypeOrmModuleOptions;

  public constructor(filePath?: string, customConfig?: Config) {
    let env: DotenvParseOutput;
    if (filePath && fileExistsSync(filePath)) {
      env = parse(readFileSync(filePath));
    }

    Object.assign(this, {
      NODE_ENV: NodeEnv.development,
      ...env, ...process.env, ...customConfig,
    });

    const errors: ValidationError[] = validateSync(this);
    if (0 < errors.length) {
      throw new Error(errors[0].toString());
    }

    this.ormConfig = {
      database: /\/.*$/i.exec(this.DB_URL)[0],
      entities: entities,
      synchronize: true,
      type: this.DB_TYPE,
      url: this.DB_URL,
    };
  }
}

export const config: ConfigService = new ConfigService(resolve(process.cwd(), '.env'));
