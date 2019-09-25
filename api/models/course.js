'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a course title'
        },
        notEmpty: {
          msg: 'Please provide a course title',
        }
      }
    },
    userId: {
      type: Sequelize.INTEGER,  
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a course description'
        },
        notEmpty: {
          msg: 'Please provide a course description',
         }
       }
    },
    estimatedTime: {
      type: Sequelize.STRING, 
      allowNull: true,
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  },
 
  { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User,{
      foreignKey: 'userId',
      targetKey: 'id'
   });              // TODO Add associations.
    
  };

  return Course;
};


// 'use strict';
// module.exports = (sequelize, Datatypes) => {
//   const Course = sequelize.define('Course', {
//     id: Datatypes.INTEGER,
//     userId:Datatypes.STRING,
//     title: Datatypes.STRING,
//     description: Datatypes.STRING,
//     estimatedTime: Datatypes.STRING,
//     materialsNeeded: Datatypes.STRING
//   }, {});
//   Course.associate = function(models) {
//     // associations can be defined here
//   };
//   return Course;
// };