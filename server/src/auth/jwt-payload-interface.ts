import { Role } from './roles.enum';

export interface JwtPayload {
  username: string;
  role: Role;
}
