import { User } from "../../users/models/user.model";




export interface JwtPayload {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  user_info: User;
}