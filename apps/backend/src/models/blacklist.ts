import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

class Blacklist extends Model {
  public id!: string;
  public organizerId!: string;
  public bannedUserId!: string;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'organizerId', as: 'organizer' });
    this.belongsTo(models.User, { foreignKey: 'bannedUserId', as: 'bannedUser' });
  }
}

Blacklist.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    organizerId: { type: DataTypes.UUID, allowNull: false },
    bannedUserId: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: 'Blacklist',
    tableName: 'blacklists',
    timestamps: false,
    underscored: true
  }
);

export default Blacklist;
