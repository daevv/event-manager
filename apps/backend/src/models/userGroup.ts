import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class UserGroup extends Model {
  public id!: string;
  public name!: string;
  public ownerId!: string;
  public members!: string[]; // Массив userId участников

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    this.hasMany(models.Event, { foreignKey: 'groupId', as: 'events' });
  }
}

UserGroup.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.UUID, allowNull: false },
    members: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: [] // Пустой массив по умолчанию
    }
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
