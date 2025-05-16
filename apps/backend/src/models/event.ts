import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class Event extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public dateTime!: Date;
  public organizerId!: string;
  public location!: { lat: number; lng: number; address: string } | null;
  public categories!: string[];
  public isLocal!: boolean;
  public isFree!: boolean;
  public groupId!: string | null;
  public participantsCount!: number;
  public maxParticipantsCount!: number | null;
  public price!: number | null;
  public imageUrl!: string | null;
  public eventStatus!: string;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'organizerId', as: 'organizer' });
    this.belongsTo(models.UserGroup, { foreignKey: 'groupId', as: 'group' });
    this.hasMany(models.EventAdmin, { foreignKey: 'eventId' });
    this.hasMany(models.EventRegistration, { foreignKey: 'eventId' });
    this.hasMany(models.Comment, { foreignKey: 'eventId' });
  }
}

Event.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    categories: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null
    },
    eventStatus: {
      type: DataTypes.ENUM('PLANNING', 'ONGOING', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PLANNING'
    },
    isLocal: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isFree: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    groupId: { type: DataTypes.UUID, allowNull: true },
    organizerId: { type: DataTypes.UUID, allowNull: false },
    participantsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    maxParticipantsCount: { type: DataTypes.INTEGER, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
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

export default Event;
