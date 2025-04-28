import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import User from '../models/user';
import * as userController from '../controllers/userController';

const router = Router();

// router.get('/', authenticate, async (req, res) => {
//   const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
//   res.json(users);
// });
//
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password_hash'] } });
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
  res.json(user);
});

router.put('/:id', authenticate, async (req, res) => {
  if (req.user!.id !== req.params.id) {
    return res.status(403).json({ message: 'Нет доступа' });
  }
  const [updated] = await User.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ message: 'Пользователь не найден' });
  res.json({ message: 'Данные обновлены' });
});
router.get('/administeredEvents', authenticate, userController.getAdministeredEvents);
router.get('/registeredEvents', authenticate, userController.getRegisteredEvents);
router.get('/organizedEvents/:id', userController.getOrganizedEvents);

export default router;
