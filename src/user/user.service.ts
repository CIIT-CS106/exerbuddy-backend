import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import { toUserDto } from 'src/shared/mapper';
import { comparePasswords } from 'src/shared/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userRepository.findOne(options);
    return toUserDto(user);
  }

  async findByLogin({ username, password }: LoginAuthDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    /**
     * Start checking the passwords
     */
    const areEqual = await comparePasswords(user.password, password);
    if (!areEqual) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
  async findByPayload({ username }: any): Promise<UserDto> {
    return await this.findOne({ username });
  }

  async create(userDto: CreateUserDto) {
    const { username, password, email } = userDto;

    const isUserExisting = await this.userRepository.findOne({
      where: { username },
    });
    /**
     * Start checking for existing users in the database.
     */
    if (isUserExisting) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user: UserEntity = await this.userRepository.create({
      username,
      password,
      email,
    });
    this.userRepository.save(user);
    return toUserDto(user);
  }
}
