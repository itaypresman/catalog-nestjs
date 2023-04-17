import { IsString, IsBoolean } from 'class-validator';


export class CreateCatalogParams {
  @IsString()
  name: string;

  @IsString()
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
