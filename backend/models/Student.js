const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    rollNo: {
      type: String,
      trim: true,
      default: ""
    },

    branch: {
      type: String,
      trim: true,
      default: ""
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },

    skills: {
      type: [String],
      default: []
    },

    github: {
      type: String,
      trim: true,
      default: ""
    },

    leetcode: {
      type: String,
      trim: true,
      default: ""
    },

    xp: {
      type: Number,
      default: 0,
      min: 0
    },

    level: {
      type: Number,
      default: 1,
      min: 1
    },

    rank: {
      type: String,
      default: "Beginner"
    },

    tasks: {
      type: [taskSchema],
      default: []
    },

    notifications: {
      type: [notificationSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);