import React, { useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      setResumeFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload only a PDF resume file.");
      setResumeFile(null);
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("PDF file size must be less than 5 MB.");
      setResumeFile(null);
      event.target.value = "";
      return;
    }

    setResumeFile(selectedFile);
  };

  const analyzeResume = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setError("Please upload your resume PDF before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      // Must match: upload.single("resume") in backend aiRoutes.js
      formData.append("resume", resumeFile, resumeFile.name);

      const response = await API.post(
        "/ai/resume-analyzer",
        formData,
        {
          headers: {
            Accept: "application/json"
          }
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.displayMessage ||
          err.response?.data?.message ||
          "Resume analysis failed. Check backend server and Ollama."
      );
    } finally {
      setLoading(false);
    }
  };

  const getList = (...lists) => {
    return lists.find((list) => Array.isArray(list) && list.length > 0) || [];
  };

  return (
    <AppLayout
      title="Resume Analyzer"
      subtitle="Upload your PDF resume and get AI-powered ATS feedback."
      role="student"
    >
      <section className="skill-hero">
        <div>
          <p className="eyebrow">AI RESUME REVIEW</p>
          <h3>Make your resume stronger for placements</h3>
          <p>
            Upload your PDF resume. Campus AI will extract its content and
            check skills, keywords, projects, and improvement points.
          </p>
        </div>

        <div className="skill-hero-icon">📄</div>
      </section>

      <section className="panel skill-form-panel">
        <div className="form-title">
          <span>📤</span>
          <h3>Upload Resume PDF</h3>
        </div>

        <div className="form-divider" />

        <form onSubmit={analyzeResume}>
          <div className="field-group">
            <label htmlFor="resume">📄 Select Resume File</label>

            <label className="pdf-upload-box" htmlFor="resume">
              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                hidden
              />

              <span className="pdf-upload-icon">📁</span>

              <strong>
                {resumeFile
                  ? resumeFile.name
                  : "Click here to choose your resume PDF"}
              </strong>

              <small>PDF only • Maximum file size: 5 MB</small>
            </label>

            {resumeFile && (
              <div className="selected-file">
                <span>✅</span>
                <span>{resumeFile.name}</span>
                <span>({(resumeFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <small>
              Include education, skills, projects, certifications, GitHub, and
              achievements for better AI feedback.
            </small>
          </div>

          <div className="skill-action-row">
            <div className="skill-tip">
              <span>💡</span>

              <div>
                <strong>Best resume analysis tip</strong>
                <p>
                  Add technologies and measurable results. Example: “Built a
                  MERN dashboard with JWT authentication.”
                </p>
              </div>
            </div>

            <div className="analyze-area">
              <button
                className="primary-button analyze-button"
                type="submit"
                disabled={loading || !resumeFile}
              >
                {loading ? "Analyzing PDF..." : "📄 Analyze Resume PDF"}
              </button>

              <small>Powered by your local Gemma AI model</small>
            </div>
          </div>
        </form>

        {error && <p className="error-text">{error}</p>}
      </section>

      {result && (
        <>
          <section className="hero-card result-hero">
            <div>
              <p className="eyebrow">AI RESUME RESULT</p>
              <h3>{result.level || "Resume"} Analysis</h3>
              <p>{result.summary || "Your resume analysis is ready."}</p>
            </div>

            <div className="score-badge">
              <strong>{result.score || result.atsScore || 0}</strong>
              <span>/ 100</span>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>⭐ Resume Strengths</h3>
              </div>

              <ul className="result-list">
                {getList(result.strengths).length ? (
                  getList(result.strengths).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No strengths found yet.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>⚠️ Missing Keywords / Gaps</h3>
              </div>

              <ul className="result-list">
                {getList(result.missingSkills, result.weaknesses).length ? (
                  getList(result.missingSkills, result.weaknesses).map(
                    (item, index) => <li key={index}>{item}</li>
                  )
                ) : (
                  <li>No major missing keywords found.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🚀 Improvement Suggestions</h3>
              </div>

              <ul className="result-list">
                {getList(result.recommendations, result.suggestions).length ? (
                  getList(result.recommendations, result.suggestions).map(
                    (item, index) => <li key={index}>{item}</li>
                  )
                ) : (
                  <li>Add project details and measurable achievements.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🗺️ Resume Improvement Plan</h3>
              </div>

              <ul className="result-list">
                {getList(result.roadmap, result.learningRoadmap).length ? (
                  getList(result.roadmap, result.learningRoadmap).map(
                    (item, index) => <li key={index}>{item}</li>
                  )
                ) : (
                  <li>Improve skills, projects, and role-specific keywords.</li>
                )}
              </ul>
            </div>

            {result.feedback && (
              <div className="panel resume-feedback-panel">
                <div className="panel-header">
                  <h3>💬 AI Feedback</h3>
                </div>

                <p className="resume-feedback-text">{result.feedback}</p>
              </div>
            )}
          </section>
        </>
      )}
    </AppLayout>
  );
}

export default ResumeAnalyzer;