import { IsString, IsBoolean, IsIn, IsArray } from 'class-validator';


export class CreateCatalogParams {
  @IsString()
  name: string;

  @IsIn(['fashion', 'home', 'general'])
  vertical: string;

  @IsBoolean()
  isPrimary: boolean;
}

export class SetPrimaryCatalogParams {
  @IsString()
  catalogId: string;

  @IsBoolean()
  isPrimary: boolean;
}

export class DeleteCatalogsParams {
  @IsArray()
  catalogIds: string[];
}
