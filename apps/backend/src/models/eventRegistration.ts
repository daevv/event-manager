import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class EventRegistration extends Model {
  public id!: string;
  public eventId!: string;
  public userId!: string;
  public status!: 'registered' | 'cancelled';

  static associate(models: any) {
    this.belongsTo(models.Event, { foreignKey: 'eventId' });
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
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

export default EventRegistration;
