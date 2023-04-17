import { ObjectId } from 'mongodb';


class CatalogDto {
  id: ObjectId;
  name: string;
  vertical: string;
  isPrimary: boolean;

  constructor({ _id, name, vertical, isPrimary }) {
    this.id = _id;
    this.name = name;
    this.vertical = vertical;
    this.isPrimary = isPrimary;
  }
}


export default CatalogDto;
