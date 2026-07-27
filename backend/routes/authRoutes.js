const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

/*
  Final authentication API URLs:

  POST http://localhost:5000/api/auth/register
  POST http://localhost:5000/api/auth/login
*/

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;