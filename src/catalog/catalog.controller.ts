import { Body, Controller, Get, Post, Request, UseGuards, Put, Delete } from '@nestjs/common';
import CatalogService from './catalog.service';
import { AuthGuard } from '../AuthGuard';
import { CreateCatalogParams, DeleteCatalogsParams, SetPrimaryCatalogParams } from './params.dto';
import CatalogDto from '../dto/catalog.dto';


@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {
  }

  @UseGuards(AuthGuard)
  @Get('/get')
  async get(@Request() req): Promise<CatalogDto[]> {
    return await this.catalogService.getCatalogList(req.user.id);
  };

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Request() req, @Body() body: CreateCatalogParams): Promise<DefaultResponse> {
    const { name, vertical, isPrimary }: CreateCatalogParams = body;
    await this.catalogService.addCatalog(req.user.id, name, vertical, isPrimary);
    return { status: true };
  };

  @UseGuards(AuthGuard)
  @Put('/edit')
  async edit(@Request() req, @Body() body: SetPrimaryCatalogParams): Promise<DefaultResponse> {
    const { catalogId, isPrimary }: SetPrimaryCatalogParams = body;
    await this.catalogService.changePrimary(req.user.id, catalogId, isPrimary);
    return { status: true };
  };

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async delete(@Request() req, @Body() body: DeleteCatalogsParams): Promise<DefaultResponse> {
    const { catalogIds }: DeleteCatalogsParams = body;
    await this.catalogService.deleteCatalogs(req.user.id, catalogIds);
    return { status: true };
  };
}
