import { Router } from 'express';
import { main } from '../Controllers/studentController.js';

const router = Router();

// Add student
router.post('/add', main);

// Delete student
router.delete('/:studentID', main);

// Update student information
router.put('/:studentID', main);

// Get all the students
router.get('/getall', main);

// Get profile information from student
router.get('/profile/:studentID', main);

// Add a single or multiple students to a group
router.put('/addtogroup', main);

// Delete a single or multiple students from a group
router.delete('/removefromgroup', main);

export default router;