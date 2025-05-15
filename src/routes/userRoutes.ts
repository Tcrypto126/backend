import { Router } from 'express';
import { getProfile, updateProfile, getAllUser, deleteUser } from '../controllers/userController';
import { auth } from '../middlewares/auth';
import { validateUpdateProfile } from '../validators/userValidators';

const router = Router();

// User routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateUpdateProfile, updateProfile);

router.delete('/delete', auth, deleteUser);
router.get('/all-user', auth, getAllUser);

export default router;