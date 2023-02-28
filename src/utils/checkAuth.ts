import { Request } from "express";
import UserModel, { UserDocument } from "../Model/User";
import jwt from "jsonwebtoken";
import { role } from "../types/role";

const SECRET_KEY = process.env.JWT_SECRET || "secretKey";

const checkAuth = async (context: { req: Request }, role?: role) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      const jwtUser = checkTokenValidity(token);
      const user = await UserModel.findById(jwtUser.id);

      if (user) {
        if (role) {
          if (user.role === role) {
            return user;
          } else {
            return false;
          }
        } else {
          return user;
        }
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  } else {
    throw new Error("Authorization header must be provided");
  }
};

export const checkTokenValidity = (token: string): UserDocument => {
  token = token.replace("Bearer ", "");
  try {
    const user: UserDocument = jwt.verify(token, SECRET_KEY) as UserDocument;
    return user;
  } catch (err) {
    throw new Error("Invalid/Expired token");
  }
};

export default checkAuth;
