import React, { useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";

function SkillGap() {
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSkills = async (event) => {
    event.preventDefault();

    if (!branch || !skills.trim()) {
      setError("Please select your branch and enter your current skills.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post("/ai/skill-gap", {
        branch,
        skills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.displayMessage ||
          err.response?.data?.message ||
          "AI analysis failed. Check backend server and Ollama."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Skill Gap Analysis"
      subtitle="Analyze your current skills and get an AI-generated placement roadmap."
    >
      <section className="skill-hero">
        <div>
          <p className="eyebrow">AI CAREER ANALYSIS</p>

          <h3>Build your placement readiness step by step</h3>

          <p>
            Enter your branch and current skills. Campus AI will identify
            missing skills and generate a personalized learning roadmap.
          </p>
        </div>

        <div className="skill-hero-icon">📊</div>
      </section>

      <section className="panel skill-form-panel">
        <div className="form-title">
          <span>🎯</span>
          <h3>Analyze Your Skills</h3>
        </div>

        <div className="form-divider" />

        <form onSubmit={analyzeSkills}>
          <div className="skill-form-grid">
            <div className="field-group">
              <label htmlFor="branch">🎓 Select Your Branch</label>

              <select
                id="branch"
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
              >
                <option value="">Choose your branch</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics and Communication Engineering</option>
                <option value="EEE">Electrical and Electronics Engineering</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="Other">Other</option>
              </select>

              <small>Select your current engineering branch.</small>
            </div>

            <div className="field-group">
              <label htmlFor="skills">💻 Current Skills</label>

              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Example: C, Python, React, Node.js"
              />

              <small>Separate each skill using a comma.</small>
            </div>
          </div>

          <div className="skill-action-row">
            <div className="skill-tip">
              <span>💡</span>

              <div>
                <strong>Better input = better roadmap</strong>

                <p>
                  Add only the skills you actually know. The AI will find the
                  remaining skills needed for your branch.
                </p>
              </div>
            </div>

            <div className="analyze-area">
              <button
                className="primary-button analyze-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Analyzing with AI..." : "✨ Analyze Skills"}
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
              <p className="eyebrow">AI RESULT</p>

              <h3>
                {result.placementReadiness || result.level || "Placement"}{" "}
                Readiness
              </h3>

              <p>
                Your skill analysis is complete. Follow the recommendations and
                roadmap below to improve your placement readiness.
              </p>
            </div>

            {result.score !== undefined && (
              <div className="score-badge">
                <strong>{result.score}</strong>
                <span>/ 100</span>
              </div>
            )}
          </section>

          <section className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>🚀 Missing Skills</h3>
              </div>

              <ul className="result-list">
                {(result.missingSkills || []).length > 0 ? (
                  result.missingSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No major skill gaps found.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🧠 Recommended Technologies</h3>
              </div>

              <ul className="result-list">
                {(result.recommendedTechnologies || result.recommendations || [])
                  .length > 0 ? (
                  (
                    result.recommendedTechnologies ||
                    result.recommendations ||
                    []
                  ).map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <li>No recommendations available.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🗺️ Learning Roadmap</h3>
              </div>

              <ul className="result-list">
                {result.roadmap ? (
                  Array.isArray(result.roadmap) ? (
                    result.roadmap.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    Object.values(result.roadmap)
                      .flat()
                      .map((item, index) => <li key={index}>{item}</li>)
                  )
                ) : (
                  <li>Roadmap will appear after analysis.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>📌 Placement Status</h3>
              </div>

              <p className="muted">
                Your current placement readiness level is:
              </p>

              <span className="badge-soft">
                {result.placementReadiness ||
                  result.level ||
                  "Assessment completed"}
              </span>
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
}

export default SkillGap;