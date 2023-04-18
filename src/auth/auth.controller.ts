import { Controller, Body, Post, Get, Headers, Res, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import AuthService from './auth.service';
import { CredentialParams } from './params.dto';
import Helper from '../utils/helper';
import { AuthGuard } from '../AuthGuard';
import UserDto from '../dto/user.dto';


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
    res.cookie('accessToken', accessToken, { maxAge: 3600000 }); //1 hour
    return { accessToken };
  };

  @Post('/login')
  async signIn(@Body() body: CredentialParams, @Headers() headers: any, @Res({ passthrough: true }) res): Promise<SignResponse> {
    const { email, password }: CredentialParams = body;
    const userAgent: string = headers.userAgent;

    const device: string = Helper.getDevice(userAgent);
    const { refreshToken, accessToken }: Tokens = await this.authService.signIn(email, password, device);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('accessToken', accessToken, { maxAge: 3600000 }); //1 hour
    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  async signOut(@Request() req, @Res({ passthrough: true }) res): Promise<LogOutResponse> {
    const refreshToken: string =  req.cookies.refreshToken;
    await this.authService.signOut(req.user.id, refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return { status: true };
  }

  @Get('/token/refresh')
  async refreshToken(@Request() req): Promise<SignResponse> {
    const refreshToken: string =  req.cookies.refreshToken;
    const user: UserDto | null = await this.authService.getUserByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException();
    }

    const accessToken: string = await this.authService.updateToken(user.id, user.email, refreshToken);
    return { accessToken };
  }
}
