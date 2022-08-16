const Sequelize = require('sequelize');
const db = require('./db');

const Subject = db.define('subject', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: false,
    },
  },
});

module.exports = Subject;
