import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";

/* Authentication Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";

/* Student Pages */
import Dashboard from "./pages/Dashboard";
import StudentProfile from "./pages/StudentProfile";
import SkillGap from "./pages/SkillGap";
import PlacementScore from "./pages/PlacementScore";
import JobRecommendation from "./pages/JobRecommendation";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AIEligibility from "./pages/AIEligibility";
import MockInterview from "./pages/MockInterview";
import AIMockInterview from "./pages/AIMockInterview";

/* Admin Pages */
import AdminDashboard from "./pages/AdminDashboard";
import AddStudent from "./pages/AddStudent";
import ViewStudents from "./pages/ViewStudents";
import AssignTask from "./pages/AssignTask";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
            <ProtectedRoute role="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute role="student">
              <SkillGap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement-score"
          element={
            <ProtectedRoute role="student">
              <PlacementScore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-recommendation"
          element={
            <ProtectedRoute role="student">
              <JobRecommendation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute role="student">
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-eligibility"
          element={
            <ProtectedRoute role="student">
              <AIEligibility />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute role="student">
              <MockInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-mock-interview"
          element={
            <ProtectedRoute role="student">
              <AIMockInterview />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-student"
          element={
            <ProtectedRoute role="admin">
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-students"
          element={
            <ProtectedRoute role="admin">
              <ViewStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign-task"
          element={
            <ProtectedRoute role="admin">
              <AssignTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute role="admin">
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute role="admin">
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;