import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class EventAdmin extends Model {
  public id!: string;
  public eventId!: string;
  public userId!: string;

  static associate(models: any) {
    this.belongsTo(models.Event, { foreignKey: 'eventId', as: 'administratedEvents' });
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
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

export default EventAdmin;
