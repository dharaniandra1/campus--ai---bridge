import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";

function Dashboard() {
  const userId = localStorage.getItem("userId");
  const [student, setStudent] = useState({
    xp: 0,
    level: 1,
    rank: "Beginner",
    tasks: [],
    notifications: []
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await API.get(`/api/students/profile/${userId}`);
        if (res.data) {
          setStudent(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadStudent();
  }, [userId]);

  const completedTasks = student.tasks?.filter((task) => task.completed).length || 0;

  return (
    <AppLayout
      title="Student Dashboard"
      subtitle="Track your placement progress, AI tools, and assigned work."
      role="student"
    >
      <section className="hero-panel">
        <h2>Build your placement readiness step by step</h2>
        <p>Use AI analysis, complete tasks, and keep your profile updated for better guidance.</p>
      </section>

      <div className="metrics-grid">
        <StatCard label="XP" value={student.xp || 0} />
        <StatCard label="Level" value={student.level || 1} tone="green" />
        <StatCard label="Open Tasks" value={(student.tasks?.length || 0) - completedTasks} tone="orange" />
        <StatCard label="Rank" value={student.rank || "Beginner"} />
      </div>

      <div className="feature-grid three">
        <div className="panel">
          <h3>AI Readiness</h3>
          <p className="muted">Find missing skills and generate a practical roadmap.</p>
          <Link className="btn btn-primary" to="/skill-gap">Analyze Skills</Link>
        </div>
        <div className="panel">
          <h3>Placement Tools</h3>
          <p className="muted">Calculate score, match jobs, and improve your resume.</p>
          <Link className="btn btn-primary" to="/placement-score">Check Score</Link>
        </div>
        <div className="panel">
          <h3>Interview Practice</h3>
          <p className="muted">Generate role-based questions and evaluate answers.</p>
          <Link className="btn btn-primary" to="/ai-mock-interview">Practice Now</Link>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Recent Tasks</h3>
            <p className="muted mb-0">Assigned preparation tasks from your admin team.</p>
          </div>
          <span className="badge-soft">{completedTasks} completed</span>
        </div>
        {student.tasks?.length ? (
          <ul className="result-list">
            {student.tasks.slice(0, 5).map((task) => (
              <li key={task._id}>{task.completed ? "Done: " : "Pending: "}{task.title}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No tasks assigned yet.</p>
        )}
      </div>
    </AppLayout>
  );
}

export default Dashboard;
