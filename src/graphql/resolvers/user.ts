import { Request } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../../Model/User";
import { role } from "../../types/role";
import checkAuth from "../../utils/checkAuth";
import Log from "../../utils/Log";

const SECRET_KEY = process.env.JWT_SECRET || "secretKey";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    SECRET_KEY,
    { expiresIn: "365d" }
  );
};

// const reactivateUser = async (user) => {
//   if (user.deactivatedAt) {
//     user.deactivatedAt = false;
//     await user.save();
//   }
// };

export default {
  Query: {
    async users(_: any, __: any, context: { req: Request }) {
      console.log("context", context.req);
      console.log(role);

      const user = await checkAuth(context);

      if (user) {
        return await UserModel.find();
      } else {
        throw new Error("Not authorized");
      }
    },
    async user(_: any, { id }: { id: string }) {
      return await UserModel.findById(id);
    },
  },
  Mutation: {
    async register(
      _: any,
      {
        userInput: { name, username, email, password },
      }: {
        userInput: {
          name: string;
          username: string;
          email: string;
          password: string;
        };
      }
    ) {
      const checkMail = await UserModel.findOne({
        email: email,
      });

      if (checkMail) {
        throw new Error("Email already exists");
      }

      const user = new UserModel({
        name,
        username,
        email,
        password,
      });

      await user.save();
      return user;
    },
    async login(
      _: any,
      {
        userInput: { email, password },
      }: {
        userInput: {
          email: string;
          password: string;
        };
      }
    ) {
      try {
        const user = await UserModel.findOne({ email: email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          throw new Error("Incorrect password");
        }
        return {
          user: user,
          token: generateToken(user),
        };
      } catch (error) {
        Log.error(error);
        throw new Error(error);
      }
    },
  },
};
