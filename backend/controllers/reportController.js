const PDFDocument = require("pdfkit");
const Student = require("../models/Student");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await Student.countDocuments();

    const totalCompletedTasks = await Student.aggregate([
      { $unwind: "$tasks" },
      { $match: { "tasks.completed": true } },
      { $count: "count" }
    ]);

    const totalXP = await Student.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$xp" }
        }
      }
    ]);

    const averageCGPA = await Student.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: "$cgpa" }
        }
      }
    ]);

    res.status(200).json({
      totalUsers,
      totalStudentProfiles: totalStudents,
      totalCompletedTasks:
        totalCompletedTasks[0]?.count || 0,
      totalXP: totalXP[0]?.total || 0,
      averageCGPA: Number(
        (averageCGPA[0]?.average || 0).toFixed(2)
      )
    });
  } catch (error) {
    console.error("Admin Stats Error:", error.message);

    res.status(500).json({
      message: "Unable to fetch admin statistics"
    });
  }
};

const exportStudentReport = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "email")
      .sort({ xp: -1, createdAt: -1 });

    const doc = new PDFDocument({
      margin: 50,
      size: "A4"
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="campus-ai-students-report.pdf"'
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text(
        "Campus AI Skill Bridge",
        {
          align: "center"
        }
      );

    doc
      .fontSize(14)
      .text(
        "Student Progress Report",
        {
          align: "center"
        }
      );

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        `Generated on: ${new Date().toLocaleString()}`
      );

    doc.moveDown();

    if (students.length === 0) {
      doc
        .fontSize(12)
        .text("No student profiles are available.");

      doc.end();
      return;
    }

    students.forEach((student, index) => {
      if (doc.y > 680) {
        doc.addPage();
      }

      doc
        .fontSize(13)
        .text(`${index + 1}. ${student.name || "Unnamed Student"}`);

      doc
        .fontSize(10)
        .text(`Email: ${student.userId?.email || "Not available"}`);

      doc.text(`Roll No: ${student.rollNo || "Not added"}`);

      doc.text(`Branch: ${student.branch || "Not added"}`);

      doc.text(`CGPA: ${student.cgpa || 0}`);

      doc.text(`Skills: ${student.skills?.join(", ") || "Not added"}`);

      doc.text(`XP: ${student.xp || 0}`);

      doc.text(`Level: ${student.level || 1}`);

      doc.text(`Rank: ${student.rank || "Beginner"}`);

      doc.text(
        `Tasks Completed: ${
          student.tasks?.filter((task) => task.completed)
            .length || 0
        } / ${student.tasks?.length || 0}`
      );

      doc.moveDown();

      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error("Export Report Error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Unable to export student report"
      });
    }
  }
};

module.exports = {
  exportStudentReport,
  getAdminStats
};