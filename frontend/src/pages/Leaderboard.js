import React, {
  useState,
  useEffect
} from "react";

import API from "../services/api";
import AdminMenu from "../components/AdminMenu";

function Leaderboard() {

  const [students,
    setStudents] =
    useState([]);

  useEffect(() => {

    loadLeaderboard();

  }, []);

  const loadLeaderboard =
    async () => {

      try {

        const res =
          await API.get(
            "/students"
          );

        const sorted =
          res.data.sort(
            (a, b) =>
              b.xp - a.xp
          );

        setStudents(
          sorted
        );

      } catch (error) {

        console.log(error);

      }

    };

  const getMedal = (index) => {

    if (index === 0)
      return "🥇";

    if (index === 1)
      return "🥈";

    if (index === 2)
      return "🥉";

    return `#${index + 1}`;

  };

  return (

    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            🏆 Leaderboard
          </h2>

          <p className="text-muted">
            Student Rankings Based on XP & Performance
          </p>

        </div>

        <AdminMenu />

      </div>

      {/* Top Performer */}

      {
        students.length > 0 &&

        <div className="card shadow mb-4">

          <div className="card-body text-center">

            <h4>
              🌟 Top Performer
            </h4>

            <h2>
              {students[0].name}
            </h2>

            <p>
              XP: {students[0].xp}
            </p>

            <span className="badge bg-warning p-2">
              Rank #1
            </span>

          </div>

        </div>
      }

      {/* Leaderboard Table */}

      <div className="card shadow">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>

                  <th>Rank</th>
                  <th>Name</th>
                  <th>XP</th>
                  <th>Level</th>
                  <th>Rank Title</th>

                </tr>

              </thead>

              <tbody>

                {
                  students.length === 0 ?

                  (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center"
                      >
                        No Student Data Found
                      </td>

                    </tr>

                  )

                  :

                  students.map(
                    (
                      student,
                      index
                    ) => (

                      <tr
                        key={
                          student._id
                        }
                      >

                        <td>
                          {
                            getMedal(
                              index
                            )
                          }
                        </td>

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.xp}
                        </td>

                        <td>
                          {student.level}
                        </td>

                        <td>
                          {student.rank}
                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center mt-5 text-muted">

        <hr />

        <p>
          © 2026 Campus AI Admin Portal |
          Student Ranking & Achievement System
        </p>

      </div>

    </div>

  );

}

export default Leaderboard;