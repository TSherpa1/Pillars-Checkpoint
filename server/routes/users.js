const router = require('express').Router();
const Sequelize = require('sequelize');
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
    //console.log(unassignedStudents);
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

router.get('/', async (req, res, next) => {
  try {
    let users = await User.findAll({
      where: {
        name: { [Sequelize.Op.iRegexp]: req.query.name },
      },
    });
    res.status(200).send(users);
  } catch (error) {
    //console.log(error);
    next(error);
  }
  //console.log(`Query: ${req.query.name}`);
});

//using route for testing
router.get('/:id', async (req, res, next) => {
  let user = await User.findByPk(req.params.id);
  res.send(await user.getMentees());
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (isNaN(req.params.id)) {
      res.status(400).send('<h1>ID must be a number!</h1>');
    } else {
      let userToDelete = await User.findByPk(req.params.id);
      if (!userToDelete) {
        res.status(404).send('<h1>User not found!</h1>');
      } else {
        await userToDelete.destroy();
        res.status(204).send(userToDelete);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let existingUser = await User.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (existingUser) {
      res
        .status(409)
        .send(`<h1>User with name ${req.body.name} already exists!`);
    } else {
      let newUser = await User.create(req.body);
      res.status(201).send(newUser);
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    let userToUpdate = await User.findByPk(req.params.id);
    //console.log(userToUpdate);
    if (!userToUpdate) {
      res.status(404).send(`<h1>Not a valid user ID!</h1>`);
    } else {
      userToUpdate.update(req.body);
      res.status(200).send(userToUpdate);
    }
  } catch (error) {
    //console.error(error);
    next(error);
  }
});

module.exports = router;
