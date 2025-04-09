import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import User from './user';

class GroupMember extends Model {
  public id!: string;
  public groupId!: string;
  public userId!: string;
}

GroupMember.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    groupId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: 'GroupMember',
    tableName: 'group_members',
    timestamps: false,
    underscored: true
  }
);

//GroupMember.belongsTo(UserGroup, { foreignKey: 'groupId' });
GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default GroupMember;
