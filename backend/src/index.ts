import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import {getConnection} from './connection';
import {LecturerController} from './lecturer/lecturer_controller';
import {CourseController} from './course/course_controller';
import {StudentController} from './student/student_controller';
import {LectureController} from './lecture/lecture_controller';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors());
async function appInit() {
  await getConnection();
  app.use(bodyParser.json());

  app.use('/lecturer', LecturerController);
  app.use('/course', CourseController);
  app.use('/student', StudentController);
  app.use('/lecture', LectureController);

  app.get('/ping', (req, res) => {
    return res.send('PONG');
  });

  app.listen(80, (err) => {
    if (!err) {
      console.log('magic is happening on 80');
    } else throw err;
  });
}

appInit().catch((err) => console.log(err));
