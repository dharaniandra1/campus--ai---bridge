const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    const role =
      req.body.role === "admin"
        ? "admin"
        : "student";

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    /*
      Create Student profile automatically only for student users.
      Admin users do not need a Student profile.
    */

    if (role === "student") {
      await Student.create({
        userId: user._id,
        name: user.name,
        rollNo: "",
        branch: "",
        cgpa: 0,
        skills: [],
        github: "",
        leetcode: "",
        xp: 0,
        level: 1,
        rank: "Beginner",
        tasks: [],
        notifications: []
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({
      message: "Unable to register user"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    /*
      Safety fallback:
      If an old student account exists but does not have
      a Student profile, create it automatically at login.
    */

    if (user.role === "student") {
      const studentProfile = await Student.findOne({
        userId: user._id
      });

      if (!studentProfile) {
        await Student.create({
          userId: user._id,
          name: user.name,
          rollNo: "",
          branch: "",
          cgpa: 0,
          skills: [],
          github: "",
          leetcode: "",
          xp: 0,
          level: 1,
          rank: "Beginner",
          tasks: [],
          notifications: []
        });
      }
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Unable to login"
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};