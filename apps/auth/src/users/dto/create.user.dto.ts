import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Email address of the user',
    required: true,
  })
  @IsEmail({})
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.',
    required: true,
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: [UserRole.ADMIN, UserRole.USER],
    description: 'Roles assigned to the user',
    required: false,
    isArray: true,
    enum: UserRole,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roles?: UserRole[];
}
