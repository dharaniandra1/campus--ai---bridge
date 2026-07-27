import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalStudentProfiles: 0,
    totalRecommendations: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsRes, statsRes] = await Promise.all([
          API.get("/students"),
          API.get("/reports/stats")
        ]);
        setStudents(studentsRes.data || []);
        setAdminStats(statsRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const tasks = students.reduce((sum, student) => sum + (student.tasks?.length || 0), 0);
    const completed = students.reduce(
      (sum, student) => sum + (student.tasks?.filter((task) => task.completed).length || 0),
      0
    );
    const top = [...students].sort((a, b) => (b.xp || 0) - (a.xp || 0))[0];

    return { tasks, completed, top };
  }, [students]);

  return (
    <AppLayout
      title="Admin Dashboard"
      subtitle="Manage students, assign tasks, and monitor placement progress."
      role="admin"
    >
      <section className="hero-panel">
        <h2>Placement operations at a glance</h2>
        <p>Keep student data, task progress, analytics, and rankings in one clean workspace.</p>
      </section>

      <div className="metrics-grid">
        <StatCard label="Total Users" value={adminStats.totalUsers} />
        <StatCard label="Profiles" value={adminStats.totalStudentProfiles} />
        <StatCard label="Recommendations" value={adminStats.totalRecommendations} tone="orange" />
        <StatCard label="Top Student" value={stats.top?.name || "None"} />
      </div>

      <div className="feature-grid three">
        <div className="panel">
          <h3>Add Student</h3>
          <p className="muted">Create student login accounts for placement preparation.</p>
          <Link className="btn btn-primary" to="/add-student">Open</Link>
        </div>
        <div className="panel">
          <h3>Assign Tasks</h3>
          <p className="muted">Send preparation tasks and help students earn XP.</p>
          <Link className="btn btn-primary" to="/assign-task">Open</Link>
        </div>
        <div className="panel">
          <h3>Leaderboard</h3>
          <p className="muted">View ranking based on XP, level, and performance.</p>
          <Link className="btn btn-primary" to="/leaderboard">Open</Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;
