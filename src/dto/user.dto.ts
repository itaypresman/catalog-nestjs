import { ObjectId } from 'mongodb';


class UserDto {
  id: ObjectId;
  email: string;
  registrationDate: Date;
  tokens: TokenMongo[];

  constructor({ _id, email, registrationDate, tokens }) {
    this.id = _id;
    this.email = email;
    this.registrationDate = registrationDate;
    this.tokens = tokens;
  }
}


export default UserDto;
