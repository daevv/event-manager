import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/db';

export enum NotificationType {
  EVENT_UPDATE = 'event_update',
  EVENT_DELETE = 'event_delete',
  ADMIN_ASSIGNED = 'admin_assigned',
  EVENT_REGISTRATION = 'event_registration',
  EVENT_CANCEL = 'event_cancel',
  EVENT_COMPLETED = 'event_completed',
  GROUP_ADDED = 'group_added',
  GROUP_EVENT_CREATED = 'group_event_created'
}

class Notification extends Model {
  public id!: number;
  public userId!: string;
  public type!: NotificationType;
  public title!: string;
  public content!: string;
  public read!: boolean;
  public eventId?: string;
  public groupId?: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  static associate(models: any) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Notification.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });

    Notification.belongsTo(models.UserGroup, {
      foreignKey: 'groupId',
      as: 'group'
    });
  }
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(NotificationType)),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    underscored: true
  }
);

export default Notification;
