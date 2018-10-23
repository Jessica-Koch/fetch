'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
      .then(() => {
        return queryInterface.createTable('Dogs', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()')
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING
          },
          breed: {
            allowNull: false,
            type: Sequelize.STRING
          },
          sex: {
            allowNull: false,
            type: Sequelize.STRING
          },
          birthday: {
            allowNull: false,
            type: Sequelize.DATE
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          userId: {
            type: Sequelize.DataTypes.UUID,
            onDelete: 'CASCADE',
            references: {
              model: 'Users',
              key: 'id',
              as: 'userId'
            }
          }
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Dogs');
  }
};
