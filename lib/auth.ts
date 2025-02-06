import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { User } from "@models/User";
dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET || ""; // Store in .env

export const generateToken = (user: User) => {
    if (!user || !user.id || !user.email) {
        throw new Error("Invalid user data for token generation");
    }
    return jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: "24h",
    });
};

export const authenticateUser = async (token: string) => {
    if (!token) throw new Error("Unauthorized");

    try {
        const decoded: any = jwt.verify(token, SECRET_KEY);
        console.log(decoded)
        const user = await User.findByPk(decoded.id);
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};
