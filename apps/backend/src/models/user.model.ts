import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/config/db';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  confirmationCode?: string | null;
  confirmationCodeExpires?: Date | null;
  isConfirmed?: boolean;
  failedAttempts: number;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare confirmationCode?: null;
  declare confirmationCodeExpires?: Date | null;
  declare isConfirmed?: boolean;
  declare failedAttempts: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmationCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmationCodeExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  }
);

// Хук для хеширования пароля перед созданием или обновлением
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});
