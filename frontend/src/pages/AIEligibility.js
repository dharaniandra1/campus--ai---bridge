import React, { useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";

function AIEligibility() {
  const [goal, setGoal] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeEligibility = async (event) => {
    event.preventDefault();

    if (!goal.trim() || !skills.trim()) {
      setError("Please enter your career goal and current skills.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post("/ai/ai-eligibility", {
        goal: goal.trim(),
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
          "AI eligibility analysis failed. Check backend server and Ollama."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="AI Eligibility Checker"
      subtitle="Check your readiness for a target career role and get a personalized improvement plan."
      role="student"
    >
      <section className="skill-hero">
        <div>
          <p className="eyebrow">AI CAREER READINESS</p>
          <h3>Check whether you are ready for your target role</h3>
          <p>
            Enter the career role you want and your current skills. Campus AI
            will estimate your readiness, identify missing skills, and suggest
            a preparation roadmap.
          </p>
        </div>

        <div className="skill-hero-icon">🤖</div>
      </section>

      <section className="panel skill-form-panel">
        <div className="form-title">
          <span>🎯</span>
          <h3>Check Your Eligibility</h3>
        </div>

        <div className="form-divider" />

        <form onSubmit={analyzeEligibility}>
          <div className="skill-form-grid">
            <div className="field-group">
              <label htmlFor="goal">🚀 Target Career Goal</label>

              <input
                id="goal"
                type="text"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder="Example: Frontend Developer"
              />

              <small>
                Example: Software Engineer, Backend Developer, Embedded
                Engineer, Data Scientist.
              </small>
            </div>

            <div className="field-group">
              <label htmlFor="skills">💻 Current Skills</label>

              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Example: React, JavaScript, Node.js, MongoDB"
              />

              <small>Separate each skill using a comma.</small>
            </div>
          </div>

          <div className="skill-action-row">
            <div className="skill-tip">
              <span>📈</span>

              <div>
                <strong>Use real skills for accurate results</strong>

                <p>
                  Add only skills you can explain in an interview. This makes
                  the readiness score and improvement plan more useful.
                </p>
              </div>
            </div>

            <div className="analyze-area">
              <button
                className="primary-button analyze-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Checking Eligibility..."
                  : "🤖 Analyze Eligibility"}
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
              <p className="eyebrow">AI ELIGIBILITY RESULT</p>
              <h3>
                {result.placementLevel || result.level || "Career"} Readiness
              </h3>
              <p>
                Your eligibility analysis is complete. Use the recommendations
                below to improve your chances for the selected role.
              </p>
            </div>

            <div className="score-badge">
              <strong>{result.readinessScore ?? result.score ?? 0}</strong>
              <span>/ 100</span>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>📌 Missing Skills</h3>
              </div>

              <ul className="result-list">
                {result.missingSkills?.length ? (
                  result.missingSkills.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No major missing skills found.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🏢 Recommended Companies</h3>
              </div>

              <ul className="result-list">
                {result.recommendedCompanies?.length ? (
                  result.recommendedCompanies.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>Company recommendations will appear here.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🗺️ Learning Roadmap</h3>
              </div>

              <ul className="result-list">
                {result.learningRoadmap?.length ? (
                  result.learningRoadmap.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>Practice core skills, projects, and interviews.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🎯 Eligibility Status</h3>
              </div>

              <p className="muted">
                Your current readiness for <strong>{goal}</strong> is:
              </p>

              <span className="badge-soft">
                {result.placementLevel ||
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

export default AIEligibility;