import { Sequelize } from 'sequelize';
import { sequelize } from '@/config/db';

// МОДЕЛИ
import User from './user';
import Event from './event';
import EventAdmin from './eventAdmin';
import EventRegistration from './eventRegistration';
import GroupMember from './groupMember';
import UserGroup from './userGroup';
import Comment from './comment';
import Notification from './notification';
import Blacklist from './blacklist';
import Log from './log';

// СОБИРАЕМ МОДЕЛИ
const models = {
  User,
  Event,
  EventAdmin,
  EventRegistration,
  GroupMember,
  UserGroup,
  Comment,
  Notification,
  Blacklist,
  Log
};

// ИНИЦИАЛИЗАЦИЯ АССОЦИАЦИЙ
Object.values(models).forEach((model: any) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// ЭКСПОРТ
export const db = {
  sequelize,
  Sequelize,
  ...models
};

export default db;
