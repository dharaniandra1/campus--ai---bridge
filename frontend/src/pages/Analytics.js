import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

import AdminMenu from "../components/AdminMenu";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {

  const data = {

    labels: [
      "Beginner",
      "Intermediate",
      "Expert"
    ],

    datasets: [

      {
        label: "Students",

        data: [12, 5, 2],

        backgroundColor: [
          "#3B82F6",
          "#F59E0B",
          "#10B981"
        ],

        borderColor: [
          "#2563EB",
          "#D97706",
          "#059669"
        ],

        borderWidth: 2

      }

    ]

  };

  const options = {

    responsive: true,

    plugins: {

      legend: {
        position: "top"
      },

      title: {
        display: true,
        text: "Student Rank Distribution"
      }

    }

  };

  return (

    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            📊 Analytics Dashboard
          </h2>

          <p className="text-muted">
            Student Performance & Placement Analytics
          </p>

        </div>

        <AdminMenu />

      </div>

      {/* Statistics Cards */}

      <div className="row">

        <div className="col-md-4 mb-3">

          <div className="card shadow border-0">

            <div className="card-body text-center">

              <h5>
                Total Students
              </h5>

              <h2>
                👨‍🎓 19
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-4 mb-3">

          <div className="card shadow border-0">

            <div className="card-body text-center">

              <h5>
                Tasks Completed
              </h5>

              <h2>
                ✅ 35
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-4 mb-3">

          <div className="card shadow border-0">

            <div className="card-body text-center">

              <h5>
                Top Rank
              </h5>

              <h2>
                🏆 Expert
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* Graph */}

      <div className="card shadow mt-4">

        <div className="card-body">

          <h4 className="mb-4">
            Student Rank Distribution
          </h4>

          <Bar
            data={data}
            options={options}
          />

        </div>

      </div>

      {/* Insights */}

      <div className="card shadow mt-4">

        <div className="card-body">

          <h5>
            📈 Analytics Insights
          </h5>

          <ul>

            <li>
              Most students are currently at Beginner level.
            </li>

            <li>
              Intermediate students are steadily progressing.
            </li>

            <li>
              Expert students represent top performers.
            </li>

            <li>
              Task completion directly impacts XP and ranking.
            </li>

          </ul>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center mt-5 text-muted">

        <hr />

        <p>
          © 2026 Campus AI Admin Portal |
          Student Performance Analytics System
        </p>

      </div>

    </div>

  );

}

export default Analytics;