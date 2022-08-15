const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('user', {
  // Add your Sequelize fields here
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: false,
    },
  },
  userType: {
    type: Sequelize.ENUM('STUDENT', 'TEACHER'),
    defaultValue: 'STUDENT',
    allowNull: false,
  },
  isStudent: {
    type: Sequelize.VIRTUAL,
    get() {
      if (this.userType === 'STUDENT') {
        return true;
      } else {
        return false;
      }
    },
  },
  isTeacher: {
    type: Sequelize.VIRTUAL,
    get() {
      if (this.userType === 'TEACHER') {
        return true;
      } else {
        return false;
      }
    },
  },
});

/**
 * We've created the association for you!
 *
 * A user can be related to another user as a mentor:
 *       SALLY (mentor)
 *         |
 *       /   \
 *     MOE   WANDA
 * (mentee)  (mentee)
 *
 * You can find the mentor of a user by the mentorId field
 * In Sequelize, you can also use the magic method getMentor()
 * You can find a user's mentees with the magic method getMentees()
 */

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

User.findUnassignedStudents = async function () {
  let unassignedStudents = await User.findAll({
    where: {
      userType: 'STUDENT',
      mentorId: null,
    },
  });
  //console.log(unassingedStudents)
  return unassignedStudents;
};

User.findTeachersAndMentees = async function () {
  let teacherAndMeentes = await User.findAll({
    where: {
      userType: 'TEACHER',
    },
    include: {
      model: User,
      as: 'mentees',
    },
  });
  return teacherAndMeentes;
};

User.beforeUpdate(async function (user) {
  let mentor = await User.findByPk(user.mentorId);
  if (mentor) {
    if (!mentor.isTeacher) {
      throw new Error(
        'You cannot update a student with a mentor who is not a teacher'
      );
    }
  }
  if (user.mentorId && user.isTeacher) {
    throw new Error(
      'You cannot update a student to a teacher when they have a mentor'
    );
  }
  if (user.isStudent && user.getMentees().length > 0) {
    throw new Error(
      'You cannot update a teacher to a student when they have mentees'
    );
  }
  console.log(await user.getMentees());
});
module.exports = User;
