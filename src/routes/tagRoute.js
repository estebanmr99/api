import { Router } from 'express';
import { addTag,
         deleteTag,
         updateTag,
         getTagsInfo} from '../controllers/tagController.js';
import { loginRequired } from '../controllers/userController.js';

const router = Router();

//add tag
router.post('/add', addTag);

// Delete tag
router.delete('/delete', loginRequired, deleteTag);

// Update student information
router.put('/update/:uniqueTagID', loginRequired, updateTag);

// Get all the tags
router.get('/getall', getTagsInfo);

//falta la ruta para obtener los tags en los filtros

export default router;