const db = require('./db');
const User = require('./User');
const Subject = require('./Subject');
const seed = require('./seed');

// If we were to create any associations between different tables
// this would be a good place to do that:

//creating a many-to-many relationship to allow for the use of the magic methods required in the extra credit specs
User.belongsToMany(Subject, { through: 'user-subject' });
Subject.belongsToMany(User, { through: 'user-subject' });

module.exports = {
  db,
  seed,
  models: {
    User,
    Subject,
  },
};
