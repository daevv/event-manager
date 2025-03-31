import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class Log extends Model {}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Ссылаемся на таблицу юзеров
        key: 'id' // На поле id в таблице событий
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events', // Ссылаемся на таблицу событий
        key: 'id' // На поле id в таблице событий
      }
    }
  },
  {
    sequelize, // Указание экземпляра Sequelize
    modelName: 'Log',
    tableName: 'logs', // Название таблицы в базе данных
    timestamps: true
  }
);

export default Log;
