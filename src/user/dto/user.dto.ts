import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
