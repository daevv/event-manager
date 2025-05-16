import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class GroupMember extends Model {
  public id!: string;
  public groupId!: string;
  public userId!: string;

  static associate(models: any) {
    this.belongsTo(models.UserGroup, { foreignKey: 'groupId' });
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
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

export default GroupMember;
