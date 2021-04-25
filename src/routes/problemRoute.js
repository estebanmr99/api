import { Router } from 'express';
import { updateProblem,
         getProblemsInfo,
         removeTagfromProblem,
         addTagToProblem,
         syncProblems} from '../controllers/problemController.js';
import { loginRequired } from '../controllers/userController.js';

const router = Router();

// Update problem information
router.put('/update/:uniqueProblemID', loginRequired, updateProblem);

// Get all the problems
router.get('/getall', loginRequired, getProblemsInfo);

// Add a single or multiple tags to problems
router.put('/addtag', loginRequired, addTagToProblem);

// Delete a single or multiple tags from problems
router.delete('/removetag', loginRequired, removeTagfromProblem);

// Sync the problems solved by students from judges
router.get('/sync', loginRequired, syncProblems);

export default router;