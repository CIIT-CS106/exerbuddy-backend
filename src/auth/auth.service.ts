import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServiceStatus } from 'src/shared/interfaces/service-status.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthToken } from './interfaces/auth-token.interface';
import { JwtPayload } from './interfaces/payload-interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<ServiceStatus> {
    let response: ServiceStatus = {
      success: true,
      message: 'Register success!',
    };
    try {
      await this.userService.create(userDto);
    } catch (error) {
      console.log(error);
      response = {
        success: false,
        message: error,
      };
    }
    return response;
  }
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByLogin(loginAuthDto);
    const token = this._createToken(user);
    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.userService.findByPayload(payload);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }: UserDto): AuthToken {
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresIn: 3600,
      accessToken,
    };
  }
}
