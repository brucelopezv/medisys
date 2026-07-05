import { User } from "../../user-component/User";



export interface JwtPayload {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  user_info: User;
}