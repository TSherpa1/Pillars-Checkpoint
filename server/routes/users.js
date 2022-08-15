const router = require('express').Router();
const {
  models: { User },
} = require('../db');

/**
 * All of the routes in this are mounted on /api/users
 * For instance:
 *
 * router.get('/hello', () => {...})
 *
 * would be accessible on the browser at http://localhost:3000/api/users/hello
 *
 * These route tests depend on the User Sequelize Model tests. However, it is
 * possible to pass the bulk of these tests after having properly configured
 * the User model's name and userType fields.
 */

// Add your routes here:

router.get('/unassigned', async (req, res, next) => {
  let unassignedStudents = await User.findUnassignedStudents();
  console.log(unassignedStudents);
  res.status(200).send(unassignedStudents);
});

router.get('/teachers', async (req, res, next) => {
  let teacherAndMeentes = await User.findTeachersAndMentees();
  res.status(200).send(teacherAndMeentes);
});

module.exports = router;
