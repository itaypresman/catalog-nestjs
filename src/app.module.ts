import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [AuthModule, CatalogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
