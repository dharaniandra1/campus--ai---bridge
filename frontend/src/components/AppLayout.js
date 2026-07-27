import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../utils/auth";

const studentLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/student-profile", label: "Student Profile" },
  { to: "/skill-gap", label: "Skill Gap" },
  { to: "/placement-score", label: "Placement Score" },
  { to: "/job-recommendation", label: "Jobs" },
  { to: "/ai-eligibility", label: "AI Eligibility" },
  { to: "/resume-analyzer", label: "Resume" },
  { to: "/mock-interview", label: "Questions" },
  { to: "/ai-mock-interview", label: "Mock Interview" }
];

const adminLinks = [
  { to: "/admin-dashboard", label: "Dashboard" },
  { to: "/add-student", label: "Add Student" },
  { to: "/view-students", label: "View Students" },
  { to: "/assign-task", label: "Assign Task" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/analytics", label: "Analytics" }
];

function AppLayout({ children, title, subtitle, role = "student", actions }) {
  const navigate = useNavigate();
  const user = getAuthUser();
  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-mark">AI</div>
          <div>
            <h1>Campus AI Bridge</h1>
            <p>{role === "admin" ? "Admin Portal" : "Student Portal"}</p>
          </div>
        </div>

        <nav className="side-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button className="logout-button" onClick={() => logout(navigate)}>
          Logout
        </button>
      </aside>

      <section className="app-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">{role === "admin" ? "Administration" : "Career workspace"}</p>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="topbar-right">
            {actions}
            <span>{user.name}</span>
          </div>
        </header>

        {children}

<footer className="app-footer">
  NSRIT © 2026 | All Rights Reserved
</footer>      </section>
    </div>
  );
}

export default AppLayout;
