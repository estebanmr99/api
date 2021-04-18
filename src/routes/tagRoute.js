import { Router } from 'express';
import { addTag,
         deleteTag,
         updateTag,
         getTagsInfo,
         getTagsNames } from '../controllers/tagController.js';
import { loginRequired } from '../controllers/userController.js';

const router = Router();

// Add tag
router.post('/add', addTag);

// Delete tag
router.delete('/delete', loginRequired, deleteTag);

// Update student information
router.put('/update/:uniqueTagID', loginRequired, updateTag);

// Get all the tags
router.get('/getall', getTagsInfo);

// Get tag names for filters
router.get('/getnames', getTagsNames);

export default router;