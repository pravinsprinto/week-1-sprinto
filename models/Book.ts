import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, DataType, Index, createIndexDecorator } from "sequelize-typescript";
import { User } from "./User";


const bookIndex = createIndexDecorator({
  unique: true,
  name: 'idx_author_id',
  using: 'BTREE',
})
@Table({
  timestamps: true,  // Includes createdAt and updatedAt by default
})
export class Book extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column({
    allowNull: false
  })
  @bookIndex
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
  @bookIndex
  authorId!: number;

  @BelongsTo(() => User) // Relationship: Book belongs to an Author
  author!: User;
}
