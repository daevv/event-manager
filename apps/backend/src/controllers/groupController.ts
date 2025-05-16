import { Request, Response } from 'express';
import UserGroup from '../models/userGroup';
import GroupMember from '../models/groupMember';
import User from '@/models/user';
import { logger } from '@/services/logger';
import { createNotification } from '@/services/notificationService';
import { NotificationType } from '@/models/notification';

export const createGroup = async (req: Request, res: Response) => {
  const { name } = req.body;
  const group = await UserGroup.create({ name, ownerId: req.user!.id });
  res.status(201).json(group);
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    // Получаем все группы с участниками за один запрос
    const groups = await UserGroup.findAll({
      include: [
        {
          model: GroupMember,
          include: [
            {
              model: User,
              as: 'user', // alias для ассоциации user
              attributes: ['id', 'firstName', 'secondName', 'email'] // Только нужные поля
            }
          ]
        }
      ]
    });

    // Преобразуем структуру
    const simplifiedGroups = groups.map((group) => {
      const plainGroup = group.get({ plain: true });
      return {
        id: plainGroup.id,
        name: plainGroup.name,
        ownerId: plainGroup.ownerId,
        createdAt: plainGroup.createdAt,
        updatedAt: plainGroup.updatedAt,
        members: plainGroup.GroupMembers?.map((member) => member.user) || [] // Обрабатываем правильное поле для users
      };
    });

    res.json(simplifiedGroups);
  } catch (error) {
    logger.error('Get groups error', { error });
    res.status(500).json({
      message: 'Произошла ошибка при получении групп'
    });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const group = await UserGroup.findByPk(req.params.id);
  if (!group) return res.status(404).json({ message: 'Группа не найдена' });
  if (group.ownerId !== req.user!.id) {
    return res.status(403).json({ message: 'Только владелец может удалить группу' });
  }
  await group.destroy();
  res.json({ message: 'Группа удалена' });
};

export const addMember = async (req: Request, res: Response) => {
  const group = await UserGroup.findByPk(req.params.id, { raw: true });
  if (!group) return res.status(404).json({ message: 'Группа не найдена' });
  if (group.ownerId !== req.user!.id) {
    return res.status(403).json({ message: 'Только владелец может добавлять участников' });
  }
  const { email } = req.body;

  const user = await User.findOne({ where: { email }, raw: true });

  if (!user) {
    return res.status(404).json({ message: 'Пользователь с таким email не найден' });
  }

  await GroupMember.create({ groupId: group.id, userId: user.id });

  const owner = await User.findByPk(req.user!.id, { raw: true });
  await createNotification({
    userId: user.id,
    type: NotificationType.GROUP_ADDED,
    title: 'Добавление в группу',
    content: `Пользователь ${owner?.name || 'Аноним'} добавил вас в группу "${group.name}"`,
    groupId: group.id
  });
  res.status(201).json({ message: 'Участник добавлен' });
};

export const removeMember = async (req: Request, res: Response) => {
  const group = await UserGroup.findByPk(req.params.id, { raw: true });
  if (!group) return res.status(404).json({ message: 'Группа не найдена' });
  if (group.ownerId !== req.user!.id) {
    return res.status(403).json({ message: 'Только владелец может удалять участников' });
  }
  await GroupMember.destroy({ where: { groupId: req.params.id, userId: req.params.user_id } });
  res.json({ message: 'Участник удален' });
};

export const getMembers = async (req: Request, res: Response) => {
  const members = await GroupMember.findAll({
    where: { groupId: req.params.id },
    include: [{ model: User, as: 'user' }]
  });
  res.json(members);
};
