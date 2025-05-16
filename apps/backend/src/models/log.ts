import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class Log extends Model {
  public id!: number;
  public level!: string;
  public message!: string;
  public meta!: Record<string, any>;
  public timestamp!: Date;
  public method?: string;
  public url?: string;
  public status?: number;
  public responseTime?: string;
  public userAgent?: string;
  public ip?: string;
  public userId?: string;
}

Log.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    level: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    meta: { type: DataTypes.JSONB, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: true },
    url: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.INTEGER, allowNull: true },
    responseTime: { type: DataTypes.STRING, allowNull: true },
    userAgent: { type: DataTypes.TEXT, allowNull: true },
    ip: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.STRING, allowNull: true }
  },
  {
    sequelize,
    modelName: 'Log',
    tableName: 'logs',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['level'] },
      { fields: ['timestamp'] },
      { fields: ['method'] },
      { fields: ['status'] },
      { fields: ['user_id'] }
    ]
  }
);

export default Log;
