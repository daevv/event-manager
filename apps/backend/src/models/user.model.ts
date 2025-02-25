import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/config/db';

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  confirmationCode?: string | null;
  confirmationCodeExpires?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare confirmationCode?: null;
  declare confirmationCodeExpires?: Date;
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
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  }
);
