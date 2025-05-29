const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

// ตัวอย่างเส้นทาง (Route)
router.get('/getalluser', userController.getAllUsers);
router.post('/login',userController.getLogin)
router.post('/updateuser',userController.updateUser)
router.post('/createuser',userController.createUser)

module.exports = router;