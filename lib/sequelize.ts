import pg from "pg"
import { Sequelize } from 'sequelize-typescript';
import { Book, } from '../models/Book';
import dotenv from 'dotenv';
import { User } from "@models/User";
import { DB_CERT } from './constant';
dotenv.config();
export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: DB_CERT
    }
  }
});

export const connectDB = async () => {
  try {
    sequelize.addModels([User, Book])
    Book.belongsTo(User, { foreignKey: 'authorId' });
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
export const syncDB = async () => {
  sequelize.addModels([User, Book])
  Book.belongsTo(User, { foreignKey: 'authorId' });
  await sequelize.sync({ alter: true });
};