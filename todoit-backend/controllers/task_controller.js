const db = require("../config/db_config");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const taskController = {
  getAllTask: (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT
        t.id,
        t.task_id,
        t.title AS task_title,
        t.description,
        t.status,
        t.priority,
        t.dueDate,
        t.category,
        t.create_by AS task_create_by,
        t.create_date AS task_create_date,
        t.update_by AS task_update_by,
        t.update_date AS task_update_date,
        t.delete_by AS task_delete_by,
        t.delete_date AS task_delete_date,
        s.id AS subtask_id,
        s.title AS subtask_title,
        s.completed,
        s.create_by AS subtask_create_by,
        s.create_date AS subtask_create_date,
        s.update_by AS subtask_update_by,
        s.update_date AS subtask_update_date
      FROM tasks t
      LEFT JOIN subtasks s ON t.task_id = s.task_id AND s.status_subtask = true
      WHERE t.user_id = ? AND t.delete_date IS NULL AND t.status_task = true
      ORDER BY t.id, s.id
    `;
  
    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error("Error in getAllTask:", err);
        return res.status(500).json({
          message: "Failed to fetch tasks.",
          error: err.message,
        });
      }
  
      const taskMap = new Map();
  
      rows.forEach(row => {
        if (!taskMap.has(row.task_id)) {
          taskMap.set(row.task_id, {
            id: row.id,
            task_id: row.task_id,
            title: row.task_title,
            description: row.description,
            status: row.status,
            priority: row.priority,
            dueDate: row.dueDate,
            category: row.category,
            create_by: row.task_create_by,
            create_date: row.task_create_date,
            update_by: row.task_update_by,
            update_date: row.task_update_date,
            delete_by: row.task_delete_by,
            delete_date: row.task_delete_date,
            subtasks: [],
          });
        }
  
        if (row.subtask_id) {
          taskMap.get(row.task_id).subtasks.push({
            id: row.subtask_id,
            title: row.subtask_title,
            completed: !!row.completed,
            create_by: row.subtask_create_by,
            create_date: row.subtask_create_date,
            update_by: row.subtask_update_by,
            update_date: row.subtask_update_date,
          });
        }
      });
  
      return res.status(200).json(Array.from(taskMap.values()));
    });
  },  

  createTask: (req, res) => {
    const { id } = req.params; // user_id
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      subtasks,
      create_by
    } = req.body;

    if (!title || !id) {
      return res.status(400).json({ message: "Title and user ID are required." });
    }

    const create_date = new Date();
    const taskId = uuidv4();

    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    const taskSql = `
    INSERT INTO tasks 
      (task_id, title, description, status, priority, dueDate, category, user_id, create_by, create_date , status_task	) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,true)
  `;

    const taskValues = [
      taskId,
      title,
      description,
      status,
      priority,
      parsedDueDate,
      category,
      id,
      create_by || id,
      create_date
    ];

    db.query(taskSql, taskValues, (err, taskResult) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).json({ message: "Failed to create task", error: err.message });
      }

      // If there are no subtasks, return early
      if (!Array.isArray(subtasks) || subtasks.length === 0) {
        return res.status(201).json({ message: "Task created successfully", taskId });
      }

      // Prepare subtasks for bulk insert
      const subtaskSql = `INSERT INTO subtasks (task_id, title, completed, create_date,create_by,status_subtask) VALUES ?`;
      const currentDate = new Date();

      const subtaskValues = subtasks.map(subtask => [
        taskId,
        subtask.title || '',
        subtask.completed ? 1 : 0,
        currentDate,
        id,
        true
      ]);

      db.query(subtaskSql, [subtaskValues], (err) => {
        if (err) {
          console.error("Error inserting subtasks:", err);
          return res.status(500).json({ message: "Task created, but failed to add subtasks", error: err.message });
        }

        return res.status(201).json({ message: "Task and subtasks created successfully", taskId });
      });
    });
  },

  updateTask: (req, res) => {
    const { user_id } = req.params;
    const {
      id,
      task_id,
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      create_by,
      create_date
    } = req.body;

    const sqlUpdate = `UPDATE tasks SET status_task = false WHERE id = ?`;

    const taskSql = `
      INSERT INTO tasks 
        (task_id,title, description, status, priority, dueDate, category, user_id, create_by, create_date,update_date,update_by,status_task) 
      VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,Now(),?,true)
    `;

    db.query(sqlUpdate, [id], (err, result) => {
      if (err) {
        console.error("Error updating task status:", err);
        return res.status(500).json({ message: "Failed to update task", error: err.message });
      }

      db.query(
        taskSql,
        [task_id, title, description, status, priority, dueDate, category, user_id, create_by, create_date, user_id],
        (err2, result2) => {
          if (err2) {
            console.error("Error inserting new task:", err2);
            return res.status(500).json({ message: "Failed to insert new task", error: err2.message });
          }

          return res.status(200).json({
            message: "Task updated and new task inserted successfully",
            newTaskId: result2.insertId,
          });
        }
      );
    });
  },

  toggleSunTask: (req, res) => {
    const { task_id } = req.params;
    const { id, title, completed, create_date, create_by } = req.body;
  
    // SQL ปิด subtask เดิม
    const sqlUpdate = `UPDATE subtasks SET status_subtask = false WHERE id = ?`;
  
    // SQL เพิ่ม subtask ใหม่
    const sqlInsert = `
      INSERT INTO subtasks (
        task_id, title, completed, create_date, create_by, status_subtask, update_date
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
  
    // ปิด subtask เดิม
    db.query(sqlUpdate, [id], (err, result) => {
      if (err) {
        console.error("Error updating old subtask:", err);
        return res.status(500).json({ message: "Failed to update old subtask", error: err.message });
      }
  
      // เพิ่ม subtask ใหม่
      db.query(
        sqlInsert,
        [task_id, title, completed, create_date, create_by, true],
        (err2, result2) => {
          if (err2) {
            console.error("Error inserting new subtask:", err2);
            return res.status(500).json({ message: "Failed to insert new subtask", error: err2.message });
          }
  
          // สำเร็จ
          return res.status(200).json({
            message: "Subtask toggled and new subtask inserted successfully",
            oldSubtaskUpdated: result.affectedRows,
            newSubtaskId: result2.insertId
          });
        }
      );
    });
  },

  deleteTask: (req, res) => {
    const { user_id, task_id } = req.params;
  
    const sqlUpdate = `
      UPDATE tasks 
      SET status_task = false, 
          delete_date = NOW(), 
          delete_by = ? 
      WHERE id = ?
    `;
  
    db.query(sqlUpdate, [user_id, task_id], (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Failed to update task", error: err.message });
      }
  
      return res.status(200).json({ message: "Task deleted successfully", result });
    });
  },

  deleteSubTask: (req, res) => {
    const { user_id, subtask_id } = req.params;
  
    const sqlUpdate = `
      UPDATE subtasks 
      SET status_subtask = false, 
          delete_date = NOW(), 
          delete_by = ? 
      WHERE id = ?
    `;
  
    db.query(sqlUpdate, [user_id, subtask_id], (err, result) => {
      if (err) {
        console.error("Error updating subtask:", err);
        return res.status(500).json({ message: "Failed to update subtask", error: err.message });
      }
  
      return res.status(200).json({ message: "Subtask deleted successfully", result });
    });
  },

  createSubTask: (req, res) => {
    const { user_id } = req.params
    const { taskId, subtaskTitle } = req.body;

    const sqlInsert = `
        INSERT INTO subtasks (task_id, title, completed, create_by, create_date, status_subtask) 
        VALUES (?, ?, false, ?, Now(), true)
    `;

    const values = [taskId, subtaskTitle, user_id];

    db.query(sqlInsert, values, (err, result) => {
        if (err) {
            console.error("Error inserting subtask:", err);
            return res.status(500).json({ message: "Error inserting subtask" });
        }
        return res.status(200).json({ message: "Subtask created successfully", subtaskId: result.insertId });
    });
}

};

module.exports = taskController;
