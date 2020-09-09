import {Router} from 'express';
import {getManager} from 'typeorm';
import {Course} from '../course/course_entity';
import {Lecture} from './lecture_entity';

import * as Joi from 'joi';
import * as Validator from 'express-joi-validation';

const validator = Validator.createValidator({});

const bodySchema = Joi.object({
  lectureName: Joi.string().required(),
  lectureDay: Joi.string().required(),
  lectureHour: Joi.string().required(),
});

const LectureController = Router();

LectureController.post(
  '/:courseid',
  validator.body(bodySchema),
  async (req, res) => {
    try {
      const lecture = new Lecture();
      const CourseRepo = getManager().getRepository(Course);
      const course = await CourseRepo.findOne({
        where: {
          course_id: req.params.courseid,
        },
      });
      if (course === undefined) {
        throw new Error('The course does not exist');
      }
      lecture.lecture_name = req.body.lectureName;
      lecture.lecture_day = req.body.lectureDay;
      lecture.lecture_hour = req.body.lectureHour;
      lecture.course = course;
      const repo = getManager().getRepository(Lecture);
      await repo.save(lecture);
      res.sendStatus(201);
    } catch (error) {
      res.send(error);
    }
  }
);

export {LectureController};
