import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoadRes, LogInDto, LogInRes, RefreshRes, RequestClass, SignUpDto } from '@app/type';
import { JwtAuthGuard, LocalAuthGuard } from '@app/auth';

@ApiTags('user')
@Controller('api/user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '정보 불러오기' })
  @ApiHeader({ description: '로그인과 재발급을 통해 발급된 accessToken', name: 'authorization' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: LogInRes })
  @ApiUnauthorizedResponse()
  public async load(@Req() { user: { id } }: RequestClass): Promise<LoadRes> {
    try {
      return this.userService.load(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('auth')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LogInDto })
  @ApiOkResponse({ type: LogInRes })
  @ApiUnauthorizedResponse()
  public logIn(@Req() { user: { id } }: RequestClass): LogInRes {
    try {
      return this.userService.logIn(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('auth/refresh')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiHeader({ description: '로그인을 통해 발급된 refreshToken', name: 'authorization' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: RefreshRes })
  @ApiUnauthorizedResponse()
  public refresh(@Req() { user: { id } }: RequestClass): RefreshRes {
    try {
      return this.userService.refresh(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put()
  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse()
  @ApiConflictResponse()
  public async signUp(@Body(new ValidationPipe()) payload: SignUpDto): Promise<void> {
    try {
      return this.userService.signUp(payload);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '정보 불러오기' })
  @ApiHeader({ description: '로그인과 재발급을 통해 발급된 accessToken', name: 'authorization' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  public async withdrawal(@Req() { user: { id } }: RequestClass): Promise<void> {
    try {
      return this.userService.withdrawal(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
