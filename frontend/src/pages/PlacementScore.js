import React, { useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";
import ResultList from "../components/ResultList";
import StatCard from "../components/StatCard";

function PlacementScore() {
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/ai/placement-score", {
        cgpa,
        skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      });
      setResult(res.data);
    } catch (err) {
      setError(err.displayMessage || "Error calculating placement score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Placement Score" subtitle="Estimate readiness from CGPA and skills." role="student">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="panel">
        <h3>Calculate Score</h3>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">CGPA</label>
            <input type="number" className="form-control" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
          </div>
          <div className="col-md-8 mb-3">
            <label className="form-label">Skills</label>
            <input className="form-control" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Java, Python" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Calculating..." : "Calculate Score"}
        </button>
      </div>

      {result && (
        <>
          <div className="metrics-grid">
            <StatCard label="Score" value={result.score ?? result.result ?? "Ready"} />
            <StatCard label="Level" value={result.level || "Generated"} tone="green" />
            <StatCard label="Minimum Target" value="70+" tone="orange" />
            <StatCard label="Range" value="0-100" />
          </div>
          <ResultList title="Improvement Suggestions" items={result.suggestions} />
        </>
      )}
    </AppLayout>
  );
}

export default PlacementScore;
