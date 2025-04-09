import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';
import User from './user';

class Blacklist extends Model {
  public id!: string;
  public organizerId!: string;
  public bannedUserId!: string;
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

Blacklist.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Blacklist.belongsTo(User, { foreignKey: 'bannedUserId', as: 'bannedUser' });

export default Blacklist;
