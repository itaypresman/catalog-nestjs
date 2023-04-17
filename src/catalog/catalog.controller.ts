import { Controller, Get } from '@nestjs/common';
import CatalogService from './catalog.service';


@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {
  }

  @Get('/')
  async main(): Promise<string> {
    return 'Catalog';
  };

}
