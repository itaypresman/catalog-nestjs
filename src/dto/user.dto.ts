import { ObjectId } from 'mongodb';


class UserDto {
  id: ObjectId;
  email: string;
  registrationDate: Date;

  constructor({ _id, email, registrationDate, tokens }) {
    this.id = _id;
    this.email = email;
    this.registrationDate = registrationDate;
  }
}


export default UserDto;
