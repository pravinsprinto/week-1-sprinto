import { Table, Column, Model, HasMany, PrimaryKey, AutoIncrement, DataType, Unique, AllowNull } from 'sequelize-typescript'
import { Book } from './Book';
import bcrypt from "bcryptjs";

const passwordUpdate = async (instance: Author) => {
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
export class Author extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    unique: true,
    validate: {
      isEmail: true,
    }
  })
  email: string;

  @Column
  password!: string; // Store hashed password

  @Column
  salt!: string; // Salt for password hashing

  @Column
  name!: string;

  @Column({
    allowNull: true,
  })
  biography: string;

  @Column({
    allowNull: true,
  })
  bornDate!: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }


  @HasMany(() => Book)
  books!: Book[];

}
