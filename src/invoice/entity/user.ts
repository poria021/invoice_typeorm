import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  //   id: ObjectId;
  id: any;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;
}
