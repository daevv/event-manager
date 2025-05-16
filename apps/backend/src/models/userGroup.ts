import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class UserGroup extends Model {
  public id!: string;
  public name!: string;
  public ownerId!: string;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    this.hasMany(models.GroupMember, { foreignKey: 'groupId' });
  }
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

export default UserGroup;
