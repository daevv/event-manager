import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  visibility: {
    type: DataTypes.ENUM('local', 'global'),
    defaultValue: 'global',
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'completed'),
    defaultValue: 'active',
  },
});
