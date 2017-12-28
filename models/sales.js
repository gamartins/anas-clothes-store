'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    date: DataTypes.DATE,
    paid: DataTypes.BOOLEAN,
    value: DataTypes.DECIMAL,
  })

  Sales.associate = (models) => {
    Sales.belongsTo(models.Users, { foreignKey: 'user_id' })
    Sales.belongsTo(models.Clothes, { foreignKey: 'clothe_id' })
    Sales.belongsTo(models.Customers, { foreignKey: 'customer_id' })
  }
  
  return Sales;
};