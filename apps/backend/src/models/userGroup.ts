import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import User from './user';
import GroupMember from '@/models/groupMember';

class UserGroup extends Model {
  public id!: string;
  public name!: string;
  public ownerId!: string;
}

UserGroup.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: 'UserGroup',
    tableName: 'user_groups',
    timestamps: true,
    underscored: true
  }
);

UserGroup.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
UserGroup.hasMany(GroupMember, { foreignKey: 'groupId' });

export default UserGroup;
