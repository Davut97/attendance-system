import {createConnection} from 'typeorm';
import {Lecturer} from './lecturer/lecturer_entity';
import {Course} from './course/course_entity';
import {Student} from './student/student_entity';
import {Lecture} from './lecture/lecture_entity';

export function getConnection() {
  return createConnection({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'changeme',
    database: 'attendance_system',
    entities: [ Lecturer, Course, Student, Lecture],
    synchronize: true,
    logging: false,
  });
}
