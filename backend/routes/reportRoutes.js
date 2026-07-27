const express = require("express");

const router = express.Router();

const {
  exportStudentReport,
  getAdminStats
} = require("../controllers/reportController");

/*
  Final Report API URLs:

  GET http://localhost:5000/api/reports/stats
  GET http://localhost:5000/api/reports/students
*/

router.get("/stats", getAdminStats);

router.get("/students", exportStudentReport);

module.exports = router;