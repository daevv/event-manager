import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import Event from './event';
import User from './user';

class EventAdmin extends Model {
  public id!: string;
  public eventId!: string;
  public userId!: string;
}

EventAdmin.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: 'EventAdmin',
    tableName: 'event_admins',
    timestamps: false,
    underscored: true
  }
);

EventAdmin.belongsTo(Event, { foreignKey: 'eventId' });
EventAdmin.belongsTo(User, { foreignKey: 'userId' });

export default EventAdmin;
