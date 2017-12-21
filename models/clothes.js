'use strict';
module.exports = (sequelize, DataTypes) => {
  var Clothes = sequelize.define('Clothes', {
    brand: DataTypes.STRING,
    description: DataTypes.STRING,
    purchase_price: DataTypes.DECIMAL,
    purchase_date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Clothes;
};