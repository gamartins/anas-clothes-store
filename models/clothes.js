'use strict';
module.exports = (sequelize, DataTypes) => {
  var Clothes = sequelize.define('Clothes', {
    brand: DataTypes.STRING,
    description: DataTypes.STRING,
    purchase_price: DataTypes.DECIMAL,
    purchase_date: DataTypes.DATE
  })

  Clothes.associate = (models) => {
    Clothes.belongsTo(models.Users, { foreignKey: 'user_id' })
  }

  return Clothes;
};