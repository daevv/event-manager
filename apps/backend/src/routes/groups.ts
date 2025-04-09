import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as groupController from '../controllers/groupController';

const router = Router();

router.post('/', authenticate, groupController.createGroup);
router.get('/', authenticate, groupController.getGroups);
router.delete('/:id', authenticate, groupController.deleteGroup);
router.post('/:id/members', authenticate, groupController.addMember);
router.delete('/:id/members/:user_id', authenticate, groupController.removeMember);
router.get('/:id/members', authenticate, groupController.getMembers);

export default router;
