import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/user/:id', userController.getUserData);

router.put('/:id', authenticate, userController.updateUserData);
router.get('/administeredEvents', authenticate, userController.getAdministeredEvents);
router.get('/organizer/:id', authenticate, userController.getOrganizer);
router.get('/registeredEvents', authenticate, userController.getRegisteredEvents);
router.get('/organizedEvents/:id', userController.getOrganizedEvents);

export default router;
