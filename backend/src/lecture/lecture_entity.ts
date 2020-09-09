import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {Course} from '../course/course_entity';
import {Student} from '../student/student_entity';

@Entity()
export class Lecture {
  @PrimaryColumn()
  lecture_name!: string;

  @Column({ nullable: false })
  lecture_day!: string;
  @Column({ nullable: false })
  lecture_hour!: string;
  @ManyToOne((type) => Course, (course) => course.lectures)
  course!: Course;
  @ManyToMany((type) => Student)
  @JoinTable()
  students!: Student[];
}
