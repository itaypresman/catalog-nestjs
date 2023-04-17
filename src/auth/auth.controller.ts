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

    const device: string = Helper.getDevice(userAgent);
    const { refreshToken, accessToken }: Tokens = await this.authService.signUp(email, password, device);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  };

  @Post('/login')
  async signIn(@Body() body: CredentialParams, @Headers() headers: any, @Res({ passthrough: true }) res): Promise<SignResponse> {
    const { email, password }: CredentialParams = body;
    const userAgent: string = headers.userAgent;

    const device: string = Helper.getDevice(userAgent);
    const { refreshToken, accessToken }: Tokens = await this.authService.signIn(email, password, device);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  async signOut(@Request() req, @Res({ passthrough: true }) res): Promise<LogOutResponse> {
    const refreshToken: string =  req.cookies.refreshToken;
    await this.authService.signOut(req.user.id, refreshToken);
    res.clearCookie('refreshToken');
    return { status: true };
  }

  @UseGuards(AuthGuard)
  @Get('/token/refresh')
  async refreshToken(@Request() req): Promise<SignResponse> {
    const refreshToken: string =  req.cookies.refreshToken;
    const { id, email } = req.user
    const accessToken: string = await this.authService.updateToken(id, email, refreshToken);
    return { accessToken };
  }
}
