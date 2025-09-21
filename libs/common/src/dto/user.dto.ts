import { UserRole } from '@app/common';

export interface UserDto {
  _id: string;
  email: string;
  password: string;
  roles: UserRole[];
}
