import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import Event from './event';
import User from './user';

class EventRegistration extends Model {
  public id!: string;
  public eventId!: string;
  public userId!: string;
  public status!: 'registered' | 'cancelled';
}

EventRegistration.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.ENUM('registered', 'cancelled'), defaultValue: 'registered' }
  },
  {
    sequelize,
    modelName: 'EventRegistration',
    tableName: 'event_registrations',
    timestamps: false,
    underscored: true
  }
);

EventRegistration.belongsTo(Event, { foreignKey: 'eventId' });
EventRegistration.belongsTo(User, { foreignKey: 'userId' });

export default EventRegistration;
