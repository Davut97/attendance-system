import {Entity, Column, PrimaryColumn, ManyToMany, JoinTable} from 'typeorm';
@Entity()
export class Student {
  @PrimaryColumn()
  student_id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column('varchar', {unique: true, length: 255})
  email!: string;
  @Column()
  password!: string;
}
