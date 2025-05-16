import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public firstName!: string;
  public secondName!: string;
  public emailVerified!: boolean;
  public interests?: string[];

  static associate(models: any) {
    this.hasMany(models.Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
    this.hasMany(models.EventAdmin, { foreignKey: 'userId' });
    this.hasMany(models.EventRegistration, { foreignKey: 'userId' });
    this.hasMany(models.Comment, { foreignKey: 'userId' });
    this.hasMany(models.GroupMember, { foreignKey: 'userId' });
    this.hasMany(models.Blacklist, { foreignKey: 'organizerId', as: 'blacklistedUsers' });
    this.hasMany(models.Blacklist, { foreignKey: 'bannedUserId', as: 'blockedByUsers' });
    this.hasMany(models.Notification, { foreignKey: 'userId' });
    this.hasMany(models.UserGroup, { foreignKey: 'ownerId', as: 'ownedGroups' });
  }
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    secondName: { type: DataTypes.STRING, allowNull: false },
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    interests: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] }
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
