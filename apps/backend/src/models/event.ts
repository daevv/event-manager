import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import User from './user';
import UserGroup from './userGroup';

class Event extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public dateTime!: Date;
  public organizerId!: string;
  public location!: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  public categories!: string[];
  public isLocal!: boolean;
  public isFree!: boolean;
  public groupId!: string | null;
  public participantsCount!: number;
  public eventStatus!: string;
  public maxParticipantsCount!: number | null;
  public price!: number | null;
  public imageUrl!: string | null;
}

Event.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    categories: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: true },
    participantsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    maxParticipantsCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    organizerId: { type: DataTypes.UUID, allowNull: false },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue('location');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('location', value ? JSON.stringify(value) : null);
      }
    },
    eventStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'PLANNING',
      validate: { isIn: [['PLANNING', 'ONGOING', 'CANCELLED', 'COMPLETED']] } // Пример
    },
    isLocal: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isFree: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    groupId: { type: DataTypes.UUID, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true }
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
    underscored: true
  }
);

Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Event.belongsTo(UserGroup, { foreignKey: 'groupId', as: 'group' });

export default Event;
