import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class Comment extends Model {
  public id!: string;
  public text!: string;
  public rating!: number;
  public userId!: string;
  public eventId!: string;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Event, { foreignKey: 'eventId', as: 'event' });
  }
}

Comment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    userId: { type: DataTypes.UUID, allowNull: false },
    eventId: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    updatedAt: false,
    underscored: true
  }
);

export default Comment;
