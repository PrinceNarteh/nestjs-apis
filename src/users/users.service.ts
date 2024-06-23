import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { FilterQuery } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) { }
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.usersRepo.create(createUserDto);
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already in use');
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return this.usersRepo.findAll();
  }

  async findOne(filter: FilterQuery<UserDocument>): Promise<UserDocument> {
    const user = await this.usersRepo.findOne(filter);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const user = await this.usersRepo.findOneAndUpdate({ id }, updateUserDto);
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const isDeleted = await this.usersRepo.delete({ id });
    return {
      message: isDeleted ? 'User deleted successfully' : 'User not found',
    };
  }
}
