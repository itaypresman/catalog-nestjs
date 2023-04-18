import { BadRequestException, Injectable } from '@nestjs/common';
import { mongoCollection } from '../utils/mongo';
import { ObjectId } from 'mongodb';
import CatalogDto from '../dto/catalog.dto';
import { NotFoundError } from 'rxjs';


@Injectable()
export class CatalogService {
  private async validateCatalogName(userId: ObjectId, name: string): Promise<void> {
    const user = await mongoCollection('users').findOne({ _id: userId, catalogs: { $elemMatch: { name } } });

    if (user) {
      throw new BadRequestException(`Catalog with name '${name}' already exists`);
    }
  };

  private async isCatalogExists(userId: ObjectId, id: string): Promise<boolean> {
    const user = await mongoCollection('users').findOne({ _id: userId, catalogs: { $elemMatch: { _id: new ObjectId(id) } } });
    return !!user;
  };

  private async validateAvailableToSetPrimary(userId: ObjectId, vertical: string, isPrimary: boolean): Promise<void> {
    if (!isPrimary) {
      return;
    }

    const user = await mongoCollection('users').findOne({ _id: userId, catalogs: { $elemMatch: { isPrimary: true } } }, { catalogs: 1 });

    if (!user) {
      return;
    }

    const catalogs: mongoCatalog[] = user.catalogs;
    for (const catalog of catalogs) {
      if ((catalog.vertical !== vertical) && catalog.isPrimary) {
        throw new BadRequestException('This catalog can not be primary');
      }
    }
  };

  private async getCatalog(userId: ObjectId, catalogId: string): Promise<mongoCatalog | null> {
    const user = await mongoCollection('users').findOne({ _id: userId }, { catalogs: 1 });

    if (!user) {
      throw new NotFoundError('User don\'t have this catalog');
    }

    const catalogs: mongoCatalog[] = user.catalogs;
    for (const catalog of catalogs) {
      if (catalog._id.toString() === catalogId) {
        return catalog;
      }
    }

    return null;
  };

  async addCatalog(userId: ObjectId, name: string, vertical: string, isPrimary: boolean): Promise<void> {
    await this.validateCatalogName(userId, name);
    await this.validateAvailableToSetPrimary(userId, vertical, isPrimary);

    const catalog: mongoCatalog = { _id: new ObjectId(), name, vertical, isPrimary };
    await mongoCollection('users').updateOne({ _id: userId }, { $push: { catalogs: catalog } });
  };

  async changePrimary(userId: ObjectId, catalogId: string, isPrimary: boolean): Promise<void> {
    if (!(await this.isCatalogExists(userId, catalogId))) {
      throw new NotFoundError(`Catalog does not exist`);
    }

    const { vertical }: { vertical: string } = await this.getCatalog(userId, catalogId);
    await this.validateAvailableToSetPrimary(userId, vertical, isPrimary);
    mongoCollection('users').updateOne({ _id: userId, catalogs: { $elemMatch: { _id: new ObjectId(catalogId) } } },  { $set: { 'catalogs.$.isPrimary': isPrimary } });
  };

  async getCatalogList(userId: ObjectId): Promise<CatalogDto[]> {
    const { catalogs } = await mongoCollection('users').findOne({ _id: userId }, { catalogs: 1 });

    return catalogs.map(row => new CatalogDto(row));
  };

  deleteCatalogs(userId: ObjectId, catalogIds: string[]): Promise<any> {
    const catalogObjIds: ObjectId[] = catalogIds.map(id => new ObjectId(id))
    return mongoCollection('users').updateOne({ _id: userId },   { $pull: { catalogs: { _id: { $in: catalogObjIds } } } }
    );
  }
}


export default CatalogService;
