import React, { useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";

function JobRecommendation() {
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cgpa || !skills.trim()) {
      setError("Please enter your CGPA and at least one skill.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post("/ai/job-recommendation", {
        cgpa: Number(cgpa),
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
          "Failed to generate job recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Job Recommendation"
      subtitle="Discover career roles based on your skills, CGPA, and placement readiness."
      role="student"
    >
      <section className="skill-hero">
        <div>
          <p className="eyebrow">AI CAREER MATCHING</p>
          <h3>Find roles that fit your profile</h3>
          <p>
            Enter your CGPA and skills. Campus AI will suggest suitable job
            roles and a preparation plan for each next step.
          </p>
        </div>

        <div className="skill-hero-icon">💼</div>
      </section>

      <section className="panel skill-form-panel">
        <div className="form-title">
          <span>🔎</span>
          <h3>Find Your Best Job Matches</h3>
        </div>

        <div className="form-divider" />

        <form onSubmit={handleSubmit}>
          <div className="skill-form-grid">
            <div className="field-group">
              <label htmlFor="cgpa">📚 Current CGPA</label>

              <input
                id="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={cgpa}
                onChange={(event) => setCgpa(event.target.value)}
                placeholder="Example: 7.25"
              />

              <small>Enter your CGPA out of 10.</small>
            </div>

            <div className="field-group">
              <label htmlFor="skills">💻 Your Skills</label>

              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Example: C, Python, React, Node.js"
              />

              <small>Separate skills with commas.</small>
            </div>
          </div>

          <div className="skill-action-row">
            <div className="skill-tip">
              <span>🎯</span>

              <div>
                <strong>Choose a clear career direction</strong>

                <p>
                  Add your real skills only. Better details help the AI suggest
                  more relevant roles and preparation steps.
                </p>
              </div>
            </div>

            <div className="analyze-area">
              <button
                className="primary-button analyze-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Finding Matches..." : "💼 Recommend Jobs"}
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
              <p className="eyebrow">AI CAREER RESULT</p>
              <h3>{result.level || "Career"} Match</h3>
              <p>{result.summary || "Your job recommendations are ready."}</p>
            </div>

            <div className="score-badge">
              <strong>{result.score || 0}</strong>
              <span>/ 100</span>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>💼 Recommended Roles</h3>
              </div>

              <ul className="result-list">
                {result.recommendations?.length ? (
                  result.recommendations.map((job, index) => (
                    <li key={index}>{job}</li>
                  ))
                ) : (
                  <li>No matching roles found yet.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>⭐ Your Strengths</h3>
              </div>

              <ul className="result-list">
                {result.strengths?.length ? (
                  result.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>Add more skills to identify strengths.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>📌 Skills to Improve</h3>
              </div>

              <ul className="result-list">
                {result.missingSkills?.length ? (
                  result.missingSkills.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No major skill gaps found.</li>
                )}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>🗺️ Career Roadmap</h3>
              </div>

              <ul className="result-list">
                {result.roadmap?.length ? (
                  result.roadmap.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>Build projects and practice interviews consistently.</li>
                )}
              </ul>
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
}

export default JobRecommendation;