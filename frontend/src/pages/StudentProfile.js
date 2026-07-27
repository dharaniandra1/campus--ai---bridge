import React, { useEffect, useState } from "react";
import API from "../services/api";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";

function StudentProfile() {
  const userId = localStorage.getItem("userId");
  const [studentId, setStudentId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    branch: "",
    cgpa: "",
    skills: "",
    xp: 0,
    level: 1,
    rank: "Beginner",
    tasks: [],
    notifications: []
  });

  const loadProfile = async () => {
    try {
      const res = await API.get(`/students/profile/${userId}`);
      if (res.data) {
        setStudentId(res.data._id);
        setStudent({
          name: res.data.name || "",
          rollNo: res.data.rollNo || "",
          branch: res.data.branch || "",
          cgpa: res.data.cgpa || "",
          skills: res.data.skills?.join(", ") || "",
          xp: res.data.xp || 0,
          level: res.data.level || 1,
          rank: res.data.rank || "Beginner",
          tasks: res.data.tasks || [],
          notifications: res.data.notifications || []
        });
      }
    } catch (err) {
      setError(err.displayMessage || "Could not load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    setStudent({ ...student, [event.target.name]: event.target.value });
  };

  const saveProfile = async () => {
    setMessage("");
    setError("");

    try {
      const payload = {
        userId,
        name: student.name,
        rollNo: student.rollNo,
        branch: student.branch,
        cgpa: Number(student.cgpa),
        skills: student.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      };

      if (studentId) {
        await API.put(`/students/${studentId}`, payload);
        setMessage("Profile updated successfully.");
      } else {
        const res = await API.post("/students", payload);
        setStudentId(res.data._id);
        setMessage("Profile saved successfully.");
      }

      setEditing(false);
      loadProfile();
    } catch (err) {
      setError(err.displayMessage || "Save failed");
    }
  };

  const completeTask = async (taskId) => {
    try {
      await API.put(`/students/${studentId}/task/${taskId}`);
      setMessage("Task completed. You earned 50 XP.");
      loadProfile();
    } catch (err) {
      setError(err.displayMessage || "Could not complete task");
    }
  };

  const skillCount = student.skills.split(",").filter(Boolean).length;

  return (
    <AppLayout
      title="Student Profile"
      subtitle="Maintain your placement profile, skills, tasks, and progress."
      role="student"
      actions={<button className="btn btn-primary" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit Profile"}</button>}
    >
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="metrics-grid">
        <StatCard label="Skills" value={skillCount} />
        <StatCard label="Tasks" value={student.tasks.length} tone="orange" />
        <StatCard label="Alerts" value={student.notifications.length} tone="red" />
        <StatCard label="Rank" value={student.rank || "Beginner"} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>{student.name || "Complete your profile"}</h3>
            <p className="muted mb-0">
              {student.branch || "Branch not set"} | Roll No: {student.rollNo || "Not set"} | CGPA: {student.cgpa || "Not set"}
            </p>
          </div>
          <span className="badge-soft">Level {student.level}</span>
        </div>

        <h5>Skills</h5>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {student.skills.split(",").filter(Boolean).map((skill) => (
            <span className="badge-soft" key={skill}>{skill.trim()}</span>
          ))}
          {!skillCount && <p className="muted mb-0">No skills added yet.</p>}
        </div>

        <h5>XP Progress</h5>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${student.xp % 100}%` }}>
            {student.xp} XP
          </div>
        </div>
      </div>

      {editing && (
        <div className="panel">
          <h3>Edit Profile</h3>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={student.name} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Roll Number</label>
              <input className="form-control" name="rollNo" value={student.rollNo} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Branch</label>
              <input className="form-control" name="branch" value={student.branch} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">CGPA</label>
              <input className="form-control" type="number" name="cgpa" value={student.cgpa} onChange={handleChange} />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Skills</label>
              <input className="form-control" name="skills" value={student.skills} onChange={handleChange} placeholder="React, Node, MongoDB" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
        </div>
      )}

      <div className="panel">
        <h3>Assigned Tasks</h3>
        {student.tasks?.length ? (
          <ul className="result-list">
            {student.tasks.map((task) => (
              <li key={task._id} className="d-flex justify-content-between align-items-center gap-3">
                <span>{task.completed ? "Done: " : "Pending: "}{task.title}</span>
                {!task.completed && (
                  <button className="btn btn-success btn-sm" onClick={() => completeTask(task._id)}>Complete</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No tasks assigned.</p>
        )}
      </div>

      <div className="panel">
        <h3>Notifications</h3>
        {student.notifications?.length ? (
          <ul className="result-list">
            {student.notifications.map((notification, index) => (
              <li key={index}>{notification.message}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No notifications.</p>
        )}
      </div>
    </AppLayout>
  );
}

export default StudentProfile;
