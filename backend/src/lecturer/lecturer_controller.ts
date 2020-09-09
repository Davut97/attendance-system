import {Router} from 'express';
import {getManager, getConnection, getRepository} from 'typeorm';
import {Lecturer} from './lecturer_entity';
import {Course} from '../course/course_entity';
import {Student} from '../student/student_entity';
import * as Joi from 'joi';
import * as Validator from 'express-joi-validation';
import {Lecture} from '../lecture/lecture_entity';
import * as json2csv from 'json2csv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {generateAccessToken, verifyJWTToken} from '../util';
import {Request, Response, NextFunction} from 'express';

const validator = Validator.createValidator({});
const LecturerController = Router();

const bodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export interface LoginRequest extends Request {
  // TODO : create payload interface
  user?: any;
}
// Lecturer log in
LecturerController.post('/login', async (req, res) => {
  try {
    const lecturerRepo = getManager().getRepository(Lecturer);
    const enteredLecturerInfo = {
      email: req.body.email,
      unHashedPassword: req.body.password,
    };
    const lecturerInDB = await lecturerRepo.findOne({
      where: {
        email: enteredLecturerInfo.email,
      },
      //select only the name and email
    });
    if (lecturerInDB === undefined) {
      throw new Error(
        `Could not find a lecturer with this email ${enteredLecturerInfo.email}`
      );
    }
    const isPasswordMatch = bcrypt.compareSync(
      enteredLecturerInfo.unHashedPassword,
      lecturerInDB.password
    );
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      throw new Error('Email and password did not match');
    }
    const accessToken = generateAccessToken(lecturerInDB);
    res.json({accessToken: accessToken});
  } catch (error) {
    console.log(error);
    // TODO : handle wrong password
  }
});

LecturerController.use(authorize);

async function authorize(req: LoginRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] as string;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    const payload = await verifyJWTToken(token);
    req.user = payload;

    const newToken = generateAccessToken(payload);
    res.setHeader('jwt', newToken);
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}
// adding a new lecturer
LecturerController.post('/', validator.body(bodySchema), async (req, res) => {
  try {
    const lecturer = new Lecturer();
    lecturer.first_name = req.body.firstName;
    lecturer.last_name = req.body.lastName;
    lecturer.email = req.body.email;
    const unHashedPassword = req.body.password;
    const hashedPassword = bcrypt.hashSync(unHashedPassword, 12);
    lecturer.password = hashedPassword;
    const repo = getManager().getRepository(Lecturer);
    await repo.save(lecturer);
    res.sendStatus(201);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});
//adding a student to a course
LecturerController.put('/course', async (req: LoginRequest, res) => {
  try {
    const courseRepo = getManager().getRepository(Course);
    const studentRepo = getManager().getRepository(Student);
    const course = await courseRepo.findOne({
      where: {
        course_id: req.query.courseId,
      },
      relations: ['students'],
    });
    if (course === undefined) {
      throw new Error('Course does not exist');
    }
    // if (req.user.id !== course.lecturer.id) {
    //   return res.sendStatus(403);
    // }
    const student = await studentRepo.findOne({
      where: {
        student_id: req.body.studentId,
      },
    });
    if (student === undefined) {
      throw 'Student does not exists';
    }
    course.students.push(student);
    await courseRepo.save(course);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});
// getting a attendance list for one lecture
LecturerController.get('/lecture', async (req, res) => {
  try {
    const lectureRepo = getManager().getRepository(Lecture);
    const lectureName = req.query.lecturename;
    const lecture = await lectureRepo.findOne({
      where: {
        lecture_name: lectureName,
      },
      relations: ['students'],
    });
    if (lecture === undefined) {
      throw new Error(`Could not find a lecture with name  ${lectureName}`);
    }
    if (lecture.students.length === 0) {
      throw new Error('there was no students in this lecture');
    }

    const listOfStudents = lecture.students.map((student) => {
      const studentObject = {
        fistName: student.first_name,
        lastName: student.last_name,
        SID: student.student_id,
        email: student.email,
      };
      return studentObject;
    });
    const json2csvParse = new json2csv.Parser();
    const csv = json2csvParse.parse(listOfStudents);
    res.set('Content-Disposition', 'attachment;filename=myfilename.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});
// Getting an attendance list for one course
LecturerController.get('/course', async (req, res) => {
  try {
    const courseRepo = getManager().getRepository(Course);
    const lectureRepo = getManager().getRepository(Lecture);
    const courseId = req.query.courseid;
    const course = await courseRepo.findOne({
      where: {
        course_id: courseId,
      },
      relations: ['lectures'],
    });
    if (course === undefined) {
      throw new Error(`Could not find a lecture with an ID: ${courseId}`);
    }
    if (course.lectures.length === 0) {
      throw new Error('there was no students in this lecture');
    }
    const attendanceList = await lectureRepo
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.students', 'student')
      .select(['lecture.lecture_name', 'student.student_id'])
      .where('lecture.course.course_id = :courseId', {courseId: courseId})
      .getMany();

    res.send(attendanceList);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});
// Getting attendance list for one student in a course
LecturerController.get('/:courseid/student', async (req, res) => {
  try {
    const lectureRepo = getManager().getRepository(Lecture);
    const courseId = req.params.courseid;
    const studentId = req.query.studentid;
    const attendanceList = await lectureRepo
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.students', 'student')
      .select([
        'lecture.lecture_name',
        'student.student_id',
        'student.first_name',
        'student.last_name',
      ])
      .where('lecture.course.course_id = :courseId', {courseId: courseId})
      .andWhere('student.student_id = :studentId', {studentId: studentId})
      .getMany();
    res.send(attendanceList);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

export {LecturerController};
