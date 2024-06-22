import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) userRepo: Model<UserDocument>) {
    super(userRepo);
  }
}
