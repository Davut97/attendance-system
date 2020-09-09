import {Router} from 'express';
import {getManager} from 'typeorm';
import {Course} from './course_entity';
import {Lecturer} from '../lecturer/lecturer_entity';

const CourseController = Router();

CourseController.post('/:id', async (req, res) => {
  try {
    const course = new Course();
    const lecturerRepo = getManager().getRepository(Lecturer);
    const lecturer = await lecturerRepo.findOne({
      where: {
        id: req.params.id,
      },
      relations: ['courses'],
    });
    if (lecturer === undefined) {
      throw new Error('Lecturer does not exist');
    }
    course.course_name = req.body.CourseName;
    course.course_id = req.body.CourseId;
    course.lecturer = lecturer;
    lecturer.courses.push(course);
    const repo = getManager().getRepository(Course);
    await repo.save(course);
    res.sendStatus(201);
  } catch (error) {
    res.send(error);
  }
});

export {CourseController};
