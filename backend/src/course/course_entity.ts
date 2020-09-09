import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import {Lecturer} from '../lecturer/lecturer_entity';
import {Student} from '../student/student_entity';
import {Lecture} from '../lecture/lecture_entity';

@Entity()
export class Course {
  @PrimaryColumn()
  course_id!: string;

  @PrimaryColumn()
  course_name!: string;
  @ManyToOne((type) => Lecturer, (lecturer) => lecturer.courses)
  lecturer!: Lecturer;
  @ManyToMany((type) => Student)
  @JoinTable()
  students!: Student[];
  @OneToMany((type) => Lecture, (lecture) => lecture.course)
  lectures!: Lecture[];
}
