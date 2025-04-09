import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public firstName!: string;
  public secondName!: string;
  public emailVerified!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secondName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false // По умолчанию email не подтвержден
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true
  }
);

export default User;
