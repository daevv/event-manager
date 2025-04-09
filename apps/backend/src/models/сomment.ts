import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import User from './user';
import Event from './event';

class Comment extends Model {
  public id!: string;
  public text!: string;
  public rating!: number;
  public userId!: string;
  public eventId!: string;
}

Comment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 } // Пятибалльная шкала
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    eventId: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    updatedAt: false, // Нет необходимости в updated_at, так как редактирование обновляет только текст
    underscored: true
  }
);

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export default Comment;
