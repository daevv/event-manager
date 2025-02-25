import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events', // Ссылаемся на таблицу событий
        key: 'id' // На поле id в таблице событий
      }
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize, // Указание экземпляра Sequelize
    modelName: 'Comment',
    tableName: 'comments', // Название таблицы в базе данных
    timestamps: false // Не использовать автоматическое создание `createdAt`, `updatedAt`
  }
);

export default Comment;
