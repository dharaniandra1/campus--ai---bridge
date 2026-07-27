const express = require("express");

const router = express.Router();

const {
  getStudents,
  getStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent,
  assignTask,
  completeTask
} = require("../controllers/studentController");

/*
  Final Student API URLs:

  GET    /api/students
  GET    /api/students/profile/:userId
  POST   /api/students
  PUT    /api/students/:id
  DELETE /api/students/:id
  POST   /api/students/:id/task
  PUT    /api/students/:id/task/:taskId
*/

router.get("/", getStudents);

router.get("/profile/:userId", getStudentProfile);

router.post("/", createStudent);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

router.post("/:id/task", assignTask);

router.put("/:id/task/:taskId", completeTask);

module.exports = router;