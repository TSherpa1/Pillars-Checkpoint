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
  try {
    let unassignedStudents = await User.findUnassignedStudents();
    console.log(unassignedStudents);
    res.status(200).send(unassignedStudents);
  } catch (error) {
    next(error);
  }
});

router.get('/teachers', async (req, res, next) => {
  try {
    let teacherAndMeentes = await User.findTeachersAndMentees();
    res.status(200).send(teacherAndMeentes);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (isNaN(req.params.id)) {
      res.status(400).send('<h1>ID must be a number!</h1>');
    }
    let userToDelete = await User.findByPk(req.params.id);
    if (!userToDelete) {
      res.status(404).send('<h1>User not found!</h1>');
    } else {
      await userToDelete.destroy();
      res.status(204).send(userToDelete);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
