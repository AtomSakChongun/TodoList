const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task_controller');

router.get('/gettaskbyuserid/:id', taskController.getAllTask);
router.post("/createbyuserid/:id",taskController.createTask)
router.post("/updatebyid/:user_id",taskController.updateTask)
router.post('/togglesubtaskbytaskId/:task_id',taskController.toggleSunTask)
router.post("/createsubtaskbyuserid/:user_id",taskController.createSubTask)
router.delete('/delete/task/:task_id/user_id/:user_id',taskController.deleteTask)
router.delete('/delete/subtask/:subtask_id/user_id/:user_id',taskController.deleteSubTask)

module.exports = router;
