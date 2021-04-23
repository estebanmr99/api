import { Router } from 'express';
import { updateProblem,
         getProblemsInfo,
         removeTagfromProblem,
         addTagToProblem,
         getJudgesAccessTokens,
         syncProblems} from '../controllers/ProblemController.js';
import { loginRequired } from '../controllers/userController.js';

const router = Router();

// Update problem information
router.put('/update/:uniqueProblemID', loginRequired, updateProblem);

// Get all the problems
router.get('/getall', getProblemsInfo);

// Add a single or multiple tags to problems
router.put('/addtag', loginRequired, addTagToProblem);

// Delete a single or multiple tags from problems
router.delete('/removetag', loginRequired, removeTagfromProblem);

// Get the required access tokens for judges with authentication
router.get('/judges/accesstokens', loginRequired, getJudgesAccessTokens);

// Sync the problems solved by students from judges
router.get('/sync', syncProblems);

export default router;