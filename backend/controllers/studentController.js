const Student = require("../models/Student");

const calculateLevelAndRank = (xp) => {
  const level = Math.floor(xp / 100) + 1;

  let rank = "Beginner";

  if (level >= 10) {
    rank = "Expert";
  } else if (level >= 5) {
    rank = "Intermediate";
  }

  return { level, rank };
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error("Get Students Error:", error.message);

    res.status(500).json({
      message: "Unable to fetch students"
    });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const student = await Student.findOne({ userId })
      .populate("userId", "name email role");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Get Student Profile Error:", error.message);

    res.status(500).json({
      message: "Unable to fetch student profile"
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      userId,
      name,
      rollNo,
      branch,
      cgpa,
      skills,
      github,
      leetcode
    } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        message: "User ID and student name are required"
      });
    }

    const existingStudent = await Student.findOne({ userId });

    if (existingStudent) {
      return res.status(409).json({
        message: "Student profile already exists for this user"
      });
    }

    const student = await Student.create({
      userId,
      name: String(name).trim(),
      rollNo: String(rollNo || "").trim(),
      branch: String(branch || "").trim(),
      cgpa: Number(cgpa || 0),
      skills: Array.isArray(skills)
        ? skills.map((skill) => String(skill).trim()).filter(Boolean)
        : [],
      github: String(github || "").trim(),
      leetcode: String(leetcode || "").trim(),
      xp: 0,
      level: 1,
      rank: "Beginner",
      tasks: [],
      notifications: []
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Create Student Error:", error.message);

    res.status(500).json({
      message: "Unable to create student profile"
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "rollNo",
      "branch",
      "cgpa",
      "skills",
      "github",
      "leetcode"
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.name !== undefined) {
      updateData.name = String(updateData.name).trim();
    }

    if (updateData.rollNo !== undefined) {
      updateData.rollNo = String(updateData.rollNo).trim();
    }

    if (updateData.branch !== undefined) {
      updateData.branch = String(updateData.branch).trim();
    }

    if (updateData.cgpa !== undefined) {
      updateData.cgpa = Number(updateData.cgpa);
    }

    if (updateData.skills !== undefined) {
      updateData.skills = Array.isArray(updateData.skills)
        ? updateData.skills
            .map((skill) => String(skill).trim())
            .filter(Boolean)
        : [];
    }

    if (updateData.github !== undefined) {
      updateData.github = String(updateData.github).trim();
    }

    if (updateData.leetcode !== undefined) {
      updateData.leetcode = String(updateData.leetcode).trim();
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Update Student Error:", error.message);

    res.status(500).json({
      message: "Unable to update student profile"
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("Delete Student Error:", error.message);

    res.status(500).json({
      message: "Unable to delete student"
    });
  }
};

const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const title = String(req.body.title || "").trim();

    if (!title) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    student.tasks.push({
      title,
      completed: false
    });

    student.notifications.push({
      message: `New task assigned: ${title}`,
      isRead: false
    });

    await student.save();

    res.status(200).json({
      message: "Task assigned successfully",
      student
    });
  } catch (error) {
    console.error("Assign Task Error:", error.message);

    res.status(500).json({
      message: "Unable to assign task"
    });
  }
};

const completeTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const task = student.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.completed) {
      return res.status(400).json({
        message: "Task is already completed"
      });
    }

    task.completed = true;

    student.xp += 50;

    const progress = calculateLevelAndRank(student.xp);

    student.level = progress.level;
    student.rank = progress.rank;

    student.notifications.push({
      message: `Task completed: ${task.title}. You earned 50 XP.`,
      isRead: false
    });

    await student.save();

    res.status(200).json({
      message: "Task completed successfully",
      student
    });
  } catch (error) {
    console.error("Complete Task Error:", error.message);

    res.status(500).json({
      message: "Unable to complete task"
    });
  }
};

module.exports = {
  getStudents,
  getStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent,
  assignTask,
  completeTask
};