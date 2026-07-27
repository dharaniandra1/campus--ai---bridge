import React, {
  useState,
  useEffect
} from "react";

import API from "../services/api";
import AdminMenu from "../components/AdminMenu";

function ViewStudents() {

  const [students,
    setStudents] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  useEffect(() => {

    loadStudents();

  }, []);

  const loadStudents =
    async () => {

      try {

        const res =
          await API.get(
            "/students"
          );

        setStudents(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  const deleteStudent =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete Student?"
        );

      if (!confirmDelete)
        return;

      try {

        await API.delete(
          `/students/${id}`
        );

        alert(
          "Student Deleted Successfully"
        );

        loadStudents();

      } catch (error) {

        console.log(error);

      }

    };

  const filteredStudents =
    students.filter(
      (student) =>

        student.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

    );

  return (

    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            👨‍🎓 View Students
          </h2>

          <p className="text-muted">
            Manage and monitor all registered students
          </p>

        </div>

        <AdminMenu />

      </div>

      {/* Statistics */}

      <div className="card shadow mb-4">

        <div className="card-body text-center">

          <h5>
            Total Students
          </h5>

          <h2>
            {students.length}
          </h2>

        </div>

      </div>

      {/* Search */}

      <div className="card shadow mb-4">

        <div className="card-body">

          <input
            type="text"
            className="form-control"
            placeholder="Search Student By Name"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* Student Table */}

      <div className="card shadow">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>

                  <th>Name</th>

                  <th>Roll No</th>

                  <th>Branch</th>

                  <th>CGPA</th>

                  <th>XP</th>

                  <th>Level</th>

                  <th>Rank</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {
                  filteredStudents.length === 0 ?

                  (

                    <tr>

                      <td
                        colSpan="8"
                        className="text-center"
                      >
                        No Students Found
                      </td>

                    </tr>

                  )

                  :

                  filteredStudents.map(
                    (student) => (

                      <tr
                        key={
                          student._id
                        }
                      >

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.rollNo}
                        </td>

                        <td>
                          {student.branch}
                        </td>

                        <td>
                          {student.cgpa}
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

                        <td>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              deleteStudent(
                                student._id
                              )
                            }
                          >
                            Delete
                          </button>

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
          Student Management System
        </p>

      </div>

    </div>

  );

}

export default ViewStudents;