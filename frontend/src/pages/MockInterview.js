import React, { useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";

function MockInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async (event) => {
    event.preventDefault();

    if (!role.trim()) {
      setError("Please enter the job role you want to prepare for.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await API.post("/ai/mock-interview", {
        role: role.trim()
      });

      setQuestions(response.data.questions || []);
    } catch (err) {
      setError(
        err.displayMessage ||
          err.response?.data?.message ||
          "Unable to generate interview questions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Interview Questions"
      subtitle="Generate role-based technical interview questions and prepare your answers."
      role="student"
    >
      <section className="skill-hero">
        <div>
          <p className="eyebrow">AI INTERVIEW PREPARATION</p>
          <h3>Practice questions before the real interview</h3>
          <p>
            Enter a target role and generate focused interview questions.
            Practice answering each question clearly with examples.
          </p>
        </div>

        <div className="skill-hero-icon">🎤</div>
      </section>

      <section className="panel skill-form-panel">
        <div className="form-title">
          <span>💬</span>
          <h3>Generate Interview Questions</h3>
        </div>

        <div className="form-divider" />

        <form onSubmit={generateQuestions}>
          <div className="field-group">
            <label htmlFor="role">💼 Target Job Role</label>

            <input
              id="role"
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Example: Backend Developer"
            />

            <small>
              Try: Software Engineer, Frontend Developer, Backend Developer,
              Data Scientist, or Embedded Engineer.
            </small>
          </div>

          <div className="skill-action-row">
            <div className="skill-tip">
              <span>🧠</span>

              <div>
                <strong>How to practice properly</strong>

                <p>
                  Read the question, answer it aloud, explain one example, and
                  then improve your answer using your project experience.
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
                  ? "Generating Questions..."
                  : "🎤 Generate Questions"}
              </button>

              <small>Powered by Campus AI interview engine</small>
            </div>
          </div>
        </form>

        {error && <p className="error-text">{error}</p>}
      </section>

      {questions.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">INTERVIEW SET</p>
              <h3>{role} Questions</h3>
            </div>

            <span className="badge-soft">
              {questions.length} Questions
            </span>
          </div>

          <div className="question-list">
            {questions.map((question, index) => (
              <article className="question-card" key={index}>
                <div className="question-number">Q{index + 1}</div>

                <div>
                  <h4>Interview Question {index + 1}</h4>
                  <p>{question}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {questions.length === 0 && !loading && (
        <section className="empty-state">
          <h4>No questions generated yet</h4>
          <p>
            Enter a role above and click Generate Questions to begin your
            interview preparation.
          </p>
        </section>
      )}
    </AppLayout>
  );
}

export default MockInterview;