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
import multer from 'multer';

var upload = multer({ dest: 'uploads/' });
const router = Router();

// Add student
router.post('/add', addStudent);

// Delete student
router.delete('/delete', loginRequired, deleteStudent);

// Update student information
router.put('/update/:uniqueStudentID', loginRequired, updateStudent);

// Get all the students
router.get('/getall', getStudentsInfo);

// Get profile information from student
router.get('/profile/:uniqueStudentID', getStudentProfile);

// Add a single or multiple students to a group
router.put('/addtogroup', loginRequired, addStudentToGroup);

// Delete a single or multiple students from a group
router.delete('/removefromgroup', loginRequired, removeStudentfromGroup);

// Add a single or multiple students
router.post('/importstudent', upload.single("file"), addStudentImported);

export default router;