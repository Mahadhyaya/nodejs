const express = require('express')
const router = express.Router();
const userController = require('../src/userController')
const user = require('../src/userschema')

router.route('/user/getAll').get(userController.getDataController);

router.route('/user/create').post(userController.createDataController);

router.route('/items/:itemId').put(userController.updateDataController).patch(userController.falseRemoveDataController);
router.route('/user/register').post(userController.registerUser);
router.route('/user/login').post(userController.loginUser);

module.exports = router;