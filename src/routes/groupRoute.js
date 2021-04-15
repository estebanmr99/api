import { Router } from 'express';
import { addGroup,
         deleteGroup,
         updateGroup,
         getGroupsInfo,
         getGroupsForFilter,
         exportGroup } from '../controllers/groupController.js';
import { loginRequired } from '../controllers/userController.js';

const router = Router();

// Add group
router.post('/add', addGroup);

// Delete group
router.delete('/delete/:uniqueGroupID', loginRequired, deleteGroup);

// Update group information
router.put('/update/:uniqueGroupID', loginRequired, updateGroup);

// Get all groups info
router.get('/getall', getGroupsInfo);

// Get all groups for filters
router.get('/filter', getGroupsForFilter);

// Get all groups for filters
router.get('/export/:uniqueGroupID', exportGroup);

export default router;