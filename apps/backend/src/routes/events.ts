import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import eventController from '../controllers/eventController';

const router = Router();

router.post('/', authenticate, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.put('/:id/favourite', authenticate, eventController.toggleFavourite);
router.delete('/:id', authenticate, eventController.deleteEvent);
router.post('/:id/admins', authenticate, eventController.addAdmin);
router.delete('/:id/admins/', authenticate, eventController.removeAdmin);
router.post('/:id/register', authenticate, eventController.registerForEvent);
router.delete('/:id/register', authenticate, eventController.cancelRegistration);
router.get('/:id/participants', authenticate, eventController.getParticipants);
router.get('/:id/admins', authenticate, eventController.getAdmins);

export default router;
