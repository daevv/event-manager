import express from 'express';
import { Event } from '../models/Event.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Создать мероприятие (только для организаторов)
router.post(
  '/',
  authenticate,
  authorizeRoles('organizer'),
  async (req, res) => {
    try {
      const event = await Event.create({ ...req.body, creatorId: req.user.id });
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Получить список мероприятий (публично доступно)
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Обновить мероприятие (только организатор или администратор)
router.put(
  '/:id',
  authenticate,
  authorizeRoles('organizer', 'admin'),
  async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);

      if (!event || event.creatorId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      await event.update(req.body);
      res.json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
