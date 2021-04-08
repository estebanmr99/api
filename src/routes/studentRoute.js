import { Router } from 'express';
import { addStudent,
         deleteStudent,
         updateStudent,
         getStudentsInfo,
         getStudentProfile,
         addStudentToGroup,
         removeStudentfromGroup,
         addStudentImported} from '../controllers/studentController.js';
import { loginRequired } from '../controllers/userController.js';

const router = Router();

// Add student
router.post('/add', addStudent);

// Delete student
router.delete('/:uniqueStudentID', loginRequired, deleteStudent);

// Update student information
router.put('/:uniqueStudentID', loginRequired, updateStudent);

// Get all the students
router.get('/getall', loginRequired, getStudentsInfo);

// Get profile information from student
router.get('/profile/:uniqueStudentID', loginRequired, getStudentProfile);

// Add a single or multiple students to a group
router.put('/addtogroup', loginRequired, addStudentToGroup);

// Delete a single or multiple students from a group
router.delete('/removefromgroup', loginRequired, removeStudentfromGroup);

// Add a single or multiple students
router.post('/importstudent', loginRequired, addStudentImported);

export default router;