import { Controller, Body, Post, Get } from '@nestjs/common';
import AuthService from './auth.service';
import { CredentialParams } from './params.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get('/')
  async main(): Promise<string> {
    return 'Auth';
  };

  @Post('/register')
  async signUp(@Body() query: CredentialParams) {
  };

  @Post('/login')
  async signIn(@Body() query: CredentialParams) {
  }

  @Get('/logout')
  async signOut() {
  }
}
