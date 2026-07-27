const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  skillGapAnalysis,
  placementScore,
  learningRoadmap,
  jobRecommendation,
  mockInterview,
  resumeAnalyzer,
  evaluateAnswer,
  aiEligibility
} = require("../controllers/aiController");

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post("/skill-gap", skillGapAnalysis);

router.post("/placement-score", placementScore);

router.post("/learning-roadmap", learningRoadmap);

router.post("/job-recommendation", jobRecommendation);

router.post("/mock-interview", mockInterview);

/* Important: "resume" must match FormData.append("resume", resumeFile) */
router.post(
  "/resume-analyzer",
  upload.single("resume"),
  resumeAnalyzer
);

router.post("/evaluate-answer", evaluateAnswer);

router.post("/ai-eligibility", aiEligibility);

module.exports = router;