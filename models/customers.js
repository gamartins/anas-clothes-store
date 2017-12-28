'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define('Customers', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  })

  Customers.associate = (models) => {
    Customers.belongsTo(models.Users, { foreignKey: 'user_id' })
  }

  return Customers
};