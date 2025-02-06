import { InferCreationAttributes, InferAttributes } from "sequelize";
import { Model, Column, DataType, HasMany, Table, AutoIncrement, PrimaryKey } from "sequelize-typescript";
import { Book } from "./Book";
import bcrypt from "bcryptjs";
const passwordUpdate = async (instance: User) => {
  if (instance.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    instance.salt = salt;
    instance.password = await bcrypt.hash(instance.password, salt);
  }
}

@Table({
  timestamps: true,
  hooks: {
    beforeCreate: passwordUpdate,
    beforeUpdate: passwordUpdate
  }
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column({
    unique: true,
    validate: {
      isEmail: {
        msg: "Invalid email address",
      },
    }
  })
  email!: string;

  @Column({
    allowNull: true,
  })
  biography?: string;

  @Column({
    allowNull: true,
  })
  profilePicture?: string;

  @Column({
    defaultValue: false,
  })
  isAuthor!: boolean;

  @Column({
    allowNull: false,
  })
  bornDate!: Date;

  @Column
  password!: string;

  @Column
  salt!: string;

  @HasMany(() => Book)
  books?: Book[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
} 