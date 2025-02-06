import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, DataType, Index, createIndexDecorator } from "sequelize-typescript";
import { User } from "./User";

@Table({
  timestamps: true,  // Includes createdAt and updatedAt by default
  tableName: 'books'
})
export class Book extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column({
    allowNull: false
  })
  @Index({
    name: 'idx_title_author',
    unique: true
  })
  title!: string;

  @Column({
    allowNull: true
  })
  description?: string;

  @Column({
    validate: {
      isUrl: true
    }
  })
  image!: string;

  @Column({
    allowNull: false,
    validate: {
      isDate: true
    }
  })
  publishedDate!: Date;

  @Column({
    defaultValue: 0,
    type: DataType.FLOAT
  })
  averageRating?: number;

  @ForeignKey(() => User) // Foreign Key
  @Column
  @Index('idx_title_author')
  authorId!: number;

  @BelongsTo(() => User) // Relationship: Book belongs to an Author
  author!: User;
}
