import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', authenticate, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', authenticate, eventController.getEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);
router.post('/:id/admins', authenticate, eventController.addAdmin);
router.delete('/:id/admins/:user_id', authenticate, eventController.removeAdmin);
router.post('/:id/register', authenticate, eventController.registerForEvent);
router.delete('/:id/register', authenticate, eventController.cancelRegistration);
router.get('/:id/participants', authenticate, eventController.getParticipants);

export default router;
