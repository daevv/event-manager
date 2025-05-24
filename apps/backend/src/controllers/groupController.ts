import { Request, Response } from 'express';
import { Op } from 'sequelize';
import UserGroup from '../models/userGroup';
import User from '@/models/user';
import { logger } from '@/services/logger';
import { createNotification } from '@/services/notificationService';
import { NotificationType } from '@/models/notification';

// Создание группы
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Название группы обязательно' });
    }

    const group = await UserGroup.create({
      name,
      ownerId: req.user!.id,
      members: [] // Инициализируем пустой массив участников
    });

    return res.status(201).json(group);
  } catch (error) {
    logger.error('Create group error', { error });
    return res.status(500).json({ message: 'Ошибка при создании группы' });
  }
};

// Получение всех групп с участниками
export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await UserGroup.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'secondName', 'email']
        }
      ],
      raw: true
    });

    // Преобразуем данные, добавляя информацию об участниках
    const simplifiedGroups = await Promise.all(
      groups.map(async (group) => {
        const members = group.members?.length
          ? await User.findAll({
              where: { id: { [Op.in]: group.members } },
              attributes: ['id', 'firstName', 'secondName', 'email']
            })
          : [];

        return {
          id: group.id,
          name: group.name,
          ownerId: group.ownerId,
          members
        };
      })
    );

    return res.json(simplifiedGroups);
  } catch (error) {
    logger.error('Get groups error', { error });
    return res.status(500).json({ message: 'Ошибка при получении групп' });
  }
};

// Удаление группы
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await UserGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }
    if (group.dataValues.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Только владелец может удалить группу' });
    }

    await group.destroy();
    return res.json({ message: 'Группа удалена' });
  } catch (error) {
    logger.error('Delete group error', { error });
    return res.status(500).json({ message: 'Ошибка при удалении группы' });
  }
};

// Добавление участника в группу
export const addMember = async (req: Request, res: Response) => {
  try {
    const group = await UserGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }
    const groupData = group.dataValues;
    if (groupData.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Только владелец может добавлять участников' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email обязателен' });
    }

    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь с таким email не найден' });
    }

    const members = groupData.members || [];
    if (members.includes(user.id)) {
      return res.status(400).json({ message: 'Пользователь уже в группе' });
    }

    members.push(user.id);
    await group.update({ members });

    const owner = await User.findByPk(req.user!.id, { raw: true });
    await createNotification({
      userId: user.id,
      type: NotificationType.GROUP_ADDED,
      title: 'Добавление в группу',
      content: `Пользователь ${owner?.firstName || 'Аноним'} добавил вас в группу "${
        groupData.name
      }"`,
      groupId: groupData.id
    });

    return res.status(201).json({ message: 'Участник добавлен' });
  } catch (error) {
    logger.error('Add member error', { error });
    return res.status(500).json({ message: 'Ошибка при добавлении участника' });
  }
};

// Удаление участника из группы
export const removeMember = async (req: Request, res: Response) => {
  try {
    const group = await UserGroup.findByPk(req.params.id);
    const groupData = group.dataValues;
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }
    if (groupData.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Только владелец может удалять участников' });
    }

    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя обязателен' });
    }

    const members = groupData.members || [];
    if (!members.includes(userId)) {
      return res.status(404).json({ message: 'Пользователь не найден в группе' });
    }

    const updatedMembers = members.filter((id) => id !== userId);
    await group.update({ members: updatedMembers });

    return res.json({ message: 'Участник удален' });
  } catch (error) {
    logger.error('Remove member error', { error });
    return res.status(500).json({ message: 'Ошибка при удалении участника' });
  }
};

// Получение участников группы
export const getMembers = async (req: Request, res: Response) => {
  try {
    const group = await UserGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    const members = group.dataValues.members?.length
      ? await User.findAll({
          where: { id: { [Op.in]: group.dataValues.members } },
          attributes: ['id', 'firstName', 'secondName', 'email']
        })
      : [];

    return res.json(members);
  } catch (error) {
    logger.error('Get members error', { error });
    return res.status(500).json({ message: 'Ошибка при получении участников' });
  }
};
