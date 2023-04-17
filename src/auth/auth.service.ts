import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { mongoCollection } from '../utils/mongo';
import * as argon2 from 'argon2';
import { jwtSecret } from '../utils/config';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';


@Injectable()
export class AuthService {
  private async isEmailRegistered(email): Promise<boolean> {
    const user = await mongoCollection('users').findOne({ email });
    return !!user;
  }

  private generateTokens(email: string): Tokens {
      const refreshToken: string = jwt.sign({ email }, jwtSecret.refresh, { expiresIn: '30d' });
      const accessToken: string = jwt.sign({ email }, jwtSecret.access, { expiresIn: '1h' });

      return { refreshToken, accessToken };
  }

   async signUp(email: string, password: string, device: string): Promise<Tokens> {
      if (await this.isEmailRegistered(email)) {
        throw new ConflictException(`Email '${email}' is already registered`);
      }

      password = await argon2.hash(password);
      const tokens: Tokens = this.generateTokens(email);
      const tokenObj: TokenMongo = { token: tokens.refreshToken, createTime: new Date(), device, isActive: true };

      await mongoCollection('users').insertOne({ email, password, registrationDate: new Date(), tokens: [tokenObj] });

      return tokens;
   }

   async signIn(email: string, password: string, device: string): Promise<Tokens> {
     const user = await mongoCollection('users').findOne({ email });

     if (!user || !(await argon2.verify(user.password, password))) {
       throw new UnauthorizedException('Incorrect login or password');
     }

     const tokens: Tokens = this.generateTokens(email);
     await this.addUserToken(user._id, tokens.refreshToken, device);

     return tokens;
   }

   addUserToken(userId: ObjectId, refreshToken: string, device: string): Promise<void> {
     const tokenObj:TokenMongo = { token: refreshToken, createTime: new Date(), device, isActive: true };
     return mongoCollection('users').updateOne({ _id: userId },  { $push: { tokens: tokenObj } });
   }
}


export default AuthService;
