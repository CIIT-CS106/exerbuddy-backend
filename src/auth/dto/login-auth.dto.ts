import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
}
