const { PDFParse } = require("pdf-parse");
const { generateResponse } = require("../services/openaiService");

const createAIResponse = ({
  module,
  summary = "",
  score = 0,
  level = "Beginner",
  strengths = [],
  missingSkills = [],
  recommendations = [],
  roadmap = [],
  questions = [],
  feedback = ""
}) => {
  return {
    success: true,
    module,
    summary,
    score: Number(score) || 0,
    level,
    strengths: Array.isArray(strengths) ? strengths : [],
    missingSkills: Array.isArray(missingSkills) ? missingSkills : [],
    recommendations: Array.isArray(recommendations) ? recommendations : [],
    roadmap: Array.isArray(roadmap) ? roadmap : [],
    questions: Array.isArray(questions) ? questions : [],
    feedback,

    readinessScore: Number(score) || 0,
    placementLevel: level,
    recommendedCompanies: Array.isArray(recommendations) ? recommendations : [],
    learningRoadmap: Array.isArray(roadmap) ? roadmap : [],
    atsScore: Number(score) || 0,
    weaknesses: Array.isArray(missingSkills) ? missingSkills : [],
    suggestions: Array.isArray(recommendations) ? recommendations : [],
    generatedAt: new Date().toISOString()
  };
};

const cleanSkills = (skills = []) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => String(skill).trim())
    .filter(Boolean);
};

const extractJson = (text) => {
  const cleanedText = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleanedText.indexOf("{");
  const end = cleanedText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI did not return valid JSON");
  }

  return JSON.parse(cleanedText.slice(start, end + 1));
};

/* Name kept as askGemma so the rest of your controller code stays unchanged */
const askGemma = async (prompt) => {
  const responseText = await generateResponse(prompt);
  return responseText || "";
};

const fallbackSkillGap = (branch, skills) => {
  const branchSkillMap = {
    CSE: ["Java", "Python", "DBMS", "OS", "DSA", "React", "Node.js"],
    ECE: ["C", "C++", "Digital Electronics", "Microcontrollers", "VLSI", "Python"],
    EEE: ["MATLAB", "Power Systems", "Control Systems", "Python"],
    ME: ["AutoCAD", "SolidWorks", "Manufacturing Process", "Python"],
    Other: ["English", "Basic Computing", "Soft Skills", "Python"]
  };

  const requiredSkills = branchSkillMap[branch] || branchSkillMap.Other;

  const missingSkills = requiredSkills.filter(
    (requiredSkill) =>
      !skills.some(
        (studentSkill) =>
          studentSkill.toLowerCase() === requiredSkill.toLowerCase()
      )
  );

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
      )
    )
  );

  const level = score >= 75 ? "High" : score >= 40 ? "Medium" : "Low";

  return createAIResponse({
    module: "Skill Gap Analysis",
    summary: `Your ${branch} profile has ${skills.length} listed skills. Focus on missing core skills to improve placement readiness.`,
    score,
    level,
    strengths: skills,
    missingSkills,
    recommendations: [
      "Learn one missing skill at a time",
      "Build a project using your strongest skills",
      "Practice aptitude and interview questions weekly"
    ],
    roadmap: [
      `Week 1: Learn fundamentals of ${missingSkills[0] || "your target skill"}`,
      "Week 2: Practice concepts and small coding problems",
      "Week 3: Build a mini project",
      "Week 4: Revise and prepare interview answers"
    ]
  });
};

const skillGapAnalysis = async (req, res) => {
  const branch = String(req.body.branch || "Other").trim();
  const skills = cleanSkills(req.body.skills);

  try {
    const prompt = `
You are a career mentor for B.Tech students.

Branch: ${branch}
Skills: ${skills.join(", ") || "No skills entered"}

Return ONLY valid JSON. No markdown. Use exactly:
{
  "summary": "short summary",
  "score": 60,
  "level": "Medium",
  "strengths": ["skill1"],
  "missingSkills": ["skill2"],
  "recommendations": ["recommendation1"],
  "roadmap": ["step1", "step2"]
}
`;

    const result = extractJson(await askGemma(prompt));

    return res.json(createAIResponse({
      module: "Skill Gap Analysis",
      ...result
    }));
  } catch (error) {
    console.log("Skill Gap AI Error:", error.message);
    return res.json(fallbackSkillGap(branch, skills));
  }
};

const jobRecommendation = async (req, res) => {
  const cgpa = Number(req.body.cgpa || 0);
  const skills = cleanSkills(req.body.skills);

  try {
    const prompt = `
You are a career mentor.

CGPA: ${cgpa}
Skills: ${skills.join(", ") || "No skills entered"}

Return ONLY valid JSON. No markdown. Use exactly:
{
  "summary": "short career summary",
  "score": 60,
  "level": "Medium",
  "strengths": ["skill1"],
  "missingSkills": ["skill2"],
  "recommendations": ["Software Engineer", "Frontend Developer"],
  "roadmap": ["step1", "step2"]
}
`;

    const result = extractJson(await askGemma(prompt));

    return res.json(createAIResponse({
      module: "Job Recommendation",
      ...result
    }));
  } catch (error) {
    return res.json(createAIResponse({
      module: "Job Recommendation",
      summary: "Based on your skills, these roles are suitable to explore.",
      score: Math.min(100, Math.round(cgpa * 10 + skills.length * 5)),
      level: "Medium",
      strengths: skills,
      missingSkills: ["Projects", "Interview Practice"],
      recommendations: ["Software Engineer", "Frontend Developer", "Backend Developer"],
      roadmap: [
        "Choose one target role",
        "Build two related projects",
        "Prepare role-based interview questions"
      ]
    }));
  }
};

const resumeAnalyzer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file was not received. Please select the resume again."
      });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    const resumeText = String(pdfData.text || "").trim();
    await parser.destroy();

    if (resumeText.length < 30) {
      return res.status(400).json({
        message: "Text could not be extracted. Upload a normal text-based PDF, not a scanned image PDF."
      });
    }

    const prompt = `
You are an ATS resume reviewer for a fresher.

Analyze ONLY this resume:
${resumeText.slice(0, 8000)}

Return ONLY valid JSON. No markdown. Use exactly:
{
  "summary": "personalized 1 or 2 line summary",
  "score": 0,
  "level": "Beginner",
  "strengths": ["3 personalized strengths"],
  "missingSkills": ["3 realistic missing skills or resume gaps"],
  "recommendations": ["3 specific improvements"],
  "roadmap": ["4 personalized steps"],
  "feedback": "personalized ATS feedback"
}
`;

    const result = extractJson(await askGemma(prompt));

    return res.status(200).json(createAIResponse({
      module: "Resume Analyzer",
      ...result
    }));
  } catch (error) {
    console.error("Resume Analyzer Error:", error.message);

    return res.status(500).json({
      message: `AI resume analysis failed: ${error.message}`
    });
  }
};

const aiEligibility = async (req, res) => {
  const goal = String(req.body.goal || "Placement").trim();
  const skills = cleanSkills(req.body.skills);

  try {
    const prompt = `
You are a placement eligibility evaluator.

Goal: ${goal}
Skills: ${skills.join(", ") || "No skills entered"}

Return ONLY valid JSON. No markdown. Use exactly:
{
  "summary": "short summary",
  "score": 60,
  "level": "Medium",
  "strengths": ["strength1"],
  "missingSkills": ["skill1"],
  "recommendedCompanies": ["TCS", "Infosys", "Wipro"],
  "learningRoadmap": ["step1", "step2", "step3"]
}
`;

    const result = extractJson(await askGemma(prompt));

    return res.json(createAIResponse({
      module: "AI Eligibility",
      summary: result.summary,
      score: result.score,
      level: result.level,
      strengths: result.strengths,
      missingSkills: result.missingSkills,
      recommendations: result.recommendedCompanies || [],
      roadmap: result.learningRoadmap || []
    }));
  } catch (error) {
    const score = Math.min(100, skills.length * 10);

    return res.json(createAIResponse({
      module: "AI Eligibility",
      summary: `You are currently preparing for ${goal}. Build skills and projects to improve eligibility.`,
      score,
      level: score >= 70 ? "High" : score >= 40 ? "Medium" : "Low",
      strengths: skills,
      missingSkills: ["Data Structures and Algorithms", "Projects", "Mock Interviews", "Cloud Deployment"],
      recommendations: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
      roadmap: [
        "Week 1: Strengthen core programming concepts",
        "Week 2: Practice DSA and aptitude questions",
        "Week 3: Build one complete portfolio project",
        "Week 4: Improve resume and GitHub profile",
        "Week 5: Practice mock interviews"
      ]
    }));
  }
};

const mockInterview = async (req, res) => {
  const role = String(req.body.role || "Software Engineer").trim();

  try {
    const prompt = `
You are a technical interviewer.

Target role: ${role}

Return ONLY valid JSON. No markdown. Use exactly:
{
  "summary": "short summary",
  "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "recommendations": ["recommendation1"]
}
`;

    const result = extractJson(await askGemma(prompt));

    return res.json(createAIResponse({
      module: "AI Mock Interview",
      summary: result.summary || `Interview questions generated for ${role}.`,
      level: "Practice",
      questions: result.questions || [],
      recommendations: result.recommendations || []
    }));
  } catch (error) {
    return res.json(createAIResponse({
      module: "AI Mock Interview",
      summary: `Practice these questions for the ${role} role.`,
      level: "Practice",
      questions: [
        "Tell me about yourself.",
        "Explain one project you built.",
        "What are your technical strengths?",
        "How do you solve a difficult problem?",
        "Why should we hire you?"
      ],
      recommendations: [
        "Keep answers structured",
        "Use project examples",
        "Practice speaking for 2 minutes per answer"
      ]
    }));
  }
};

const evaluateAnswer = async (req, res) => {
  const question = String(req.body.question || "").trim();
  const answer = String(req.body.answer || "").trim();

  try {
    const prompt = `
You are an interview evaluator.

Question: ${question}
Answer: ${answer}

Return ONLY valid JSON. No markdown. Use exactly:
{
  "summary": "short summary",
  "score": 70,
  "level": "Good",
  "strengths": ["strength1"],
  "missingSkills": ["improvement1"],
  "recommendations": ["recommendation1"],
  "feedback": "short feedback"
}
`;

    const result = extractJson(await askGemma(prompt));

    return res.json(createAIResponse({
      module: "Interview Answer Evaluation",
      ...result
    }));
  } catch (error) {
    const score = answer.length >= 80 ? 75 : answer.length >= 35 ? 55 : 30;

    return res.json(createAIResponse({
      module: "Interview Answer Evaluation",
      summary: "Your answer was evaluated based on clarity and detail.",
      score,
      level: score >= 70 ? "Good" : score >= 50 ? "Average" : "Needs Improvement",
      strengths: ["You attempted the question"],
      missingSkills: ["Detailed explanation", "Real-world example"],
      recommendations: [
        "Explain why the concept is important",
        "Add one project or real-world example"
      ],
      feedback: score >= 70
        ? "Good answer. Add one example to make it stronger."
        : "Add more explanation and one relevant example."
    }));
  }
};

const learningRoadmap = async (req, res) => {
  const goal = String(req.body.goal || "Software Development").trim();

  return res.json(createAIResponse({
    module: "Learning Roadmap",
    summary: `Four-step roadmap created for ${goal}.`,
    level: "Learning",
    recommendations: ["Follow the roadmap consistently"],
    roadmap: [
      "Month 1: Learn fundamentals",
      "Month 2: Practice core concepts",
      "Month 3: Build projects",
      "Month 4: Prepare resume and interviews"
    ]
  }));
};

const placementScore = async (req, res) => {
  const cgpa = Number(req.body.cgpa || 0);
  const skills = cleanSkills(req.body.skills);
  const score = Math.min(100, Math.round(cgpa * 10 + skills.length * 5));

  return res.json(createAIResponse({
    module: "Placement Score",
    summary: "Your score is calculated from CGPA and entered skills.",
    score,
    level: score >= 80 ? "Expert" : score >= 60 ? "Intermediate" : "Beginner",
    strengths: skills,
    missingSkills: ["Projects", "Interview Practice"],
    recommendations: [
      "Build role-based projects",
      "Practice coding and aptitude",
      "Improve resume and communication"
    ],
    roadmap: [
      "Strengthen technical skills",
      "Build projects",
      "Practice interviews"
    ]
  }));
};

module.exports = {
  skillGapAnalysis,
  placementScore,
  learningRoadmap,
  jobRecommendation,
  mockInterview,
  resumeAnalyzer,
  evaluateAnswer,
  aiEligibility
};