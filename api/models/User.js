'use strict';
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      } 
    },  
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      }
    },
  },
      { sequelize });
    
      User.associate = (models) => {   //Tells Sequelize that a user can be associated with one or more (or "many") courses.
        User.hasMany(models.Course, {
          foreignKey: 'userId',
          targetKey: 'id'
       });           // TODO Add associations.
      };
      return User;
    };

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     id: DataTypes.INTEGER,
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     emailAddress: DataTypes.STRING,
//     password: DataTypes.STRING
//   }, {});
//   User.associate = function(models) {
//     // associations can be defined here
//   };
//   return User;
// };