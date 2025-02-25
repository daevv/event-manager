import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/config/db';
import Comment from '@/models/comment.model';

interface EventAttributes {
  id: number;
  title: string;
  description?: string;
  organiserId: number;
  maxCapacity: number;
  participantsId?: number[];
  dateStart: Date;
  dateEnd: Date;
  placeId: number;
  isLocal: boolean;
  rating?: number;
  price?: number;
  city: string;
  dateCreate: Date;
}

// Указываем, какие поля необязательны при создании новой записи
type EventCreationAttributes = Optional<
  EventAttributes,
  'id' | 'rating' | 'price' | 'description' | 'participantsId'
>;

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public organiserId!: number;
  public maxCapacity!: number;
  public participantsId?: number[];
  public dateStart!: Date;
  public dateEnd!: Date;
  public placeId!: number;
  public isLocal!: boolean;
  public rating?: number;
  public price?: number;
  public city!: string;
  public dateCreate!: Date;

  // Тут можно добавить методы для модели, если нужно
}

Event.init(
  {
    // Поля мероприятия
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organiserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    participantsId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Для списка участников
      allowNull: true
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isLocal: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateCreate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize, // Указание экземпляра Sequelize
    modelName: 'Event',
    tableName: 'events', // Название таблицы в базе данных
    timestamps: false // Не использовать автоматическое создание `createdAt`, `updatedAt`
  }
);

Event.hasMany(Comment, { foreignKey: 'eventId' });
Comment.belongsTo(Event, { foreignKey: 'eventId' });

export default Event;
