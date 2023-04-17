import { Controller, Body, Post, Get, Headers, Res, UseGuards, Request } from '@nestjs/common';
import AuthService from './auth.service';
import { CredentialParams } from './params.dto';
import Helper from '../utils/helper';
import { AuthGuard } from '../AuthGuard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get('/')
  async main(): Promise<string> {
    return 'Auth';
  };

  @Post('/register')
  async signUp(@Body() body: CredentialParams, @Headers() headers: any, @Res({ passthrough: true }) res): Promise<SignResponse> {
    const { email, password }: CredentialParams = body;
    const userAgent: string = headers.userAgent;

    const device = Helper.getDevice(userAgent);
    const { refreshToken, accessToken }: Tokens = await this.authService.signUp(email, password, device);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maximumAge: 60 * 1000});
    return { accessToken };
  };

  @Post('/login')
  async signIn(@Body() body: CredentialParams, @Headers() headers: any, @Res({ passthrough: true }) res): Promise<SignResponse> {
    const { email, password }: CredentialParams = body;
    const userAgent: string = headers.userAgent;

    const device: string = Helper.getDevice(userAgent);
    const { refreshToken, accessToken }: Tokens = await this.authService.signIn(email, password, device);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maximumAge: 60 * 1000});
    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  async signOut(@Request() req): Promise<LogOutResponse> {
    return { status: true };
  }
}
