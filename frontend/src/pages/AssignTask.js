import React, {
  useState,
  useEffect
} from "react";

import API from "../services/api";
import AdminMenu from "../components/AdminMenu";

function AssignTask() {

  const [students,
    setStudents] =
    useState([]);

  const [studentId,
    setStudentId] =
    useState("");

  const [task,
    setTask] =
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

  const assignTask =
    async () => {

      if (
        !studentId ||
        !task
      ) {

        alert(
          "Please fill all fields"
        );

        return;

      }

      try {

        await API.post(
          `/students/${studentId}/task`,
          {
            title: task
          }
        );

        alert(
          "Task Assigned Successfully"
        );

        setTask("");

      } catch (error) {

        console.log(error);

        alert(
          "Task Assignment Failed"
        );

      }

    };

  return (

    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            📋 Assign Task
          </h2>

          <p className="text-muted">
            Assign placement preparation tasks to students
          </p>

        </div>

        <AdminMenu />

      </div>

      {/* Assign Task Card */}

      <div className="card shadow">

        <div className="card-body">

          <h4 className="mb-4">
            Task Assignment Form
          </h4>

          <label className="fw-bold mb-2">
            Select Student
          </label>

          <select
            className="form-control mb-4"
            value={studentId}
            onChange={(e) =>
              setStudentId(
                e.target.value
              )
            }
          >

            <option value="">
              Choose Student
            </option>

            {
              students.map(
                (student) => (

                  <option
                    key={
                      student._id
                    }
                    value={
                      student._id
                    }
                  >
                    {student.name}
                    {" - "}
                    {student.rollNo}
                  </option>

                )
              )
            }

          </select>

          <label className="fw-bold mb-2">
            Task Name
          </label>

          <input
            type="text"
            className="form-control mb-4"
            placeholder="Enter Task Name"
            value={task}
            onChange={(e) =>
              setTask(
                e.target.value
              )
            }
          />

          <button
            className="btn btn-warning"
            onClick={
              assignTask
            }
          >
            Assign Task
          </button>

        </div>

      </div>

      {/* Information Card */}

      <div className="card shadow mt-4">

        <div className="card-body">

          <h5>
            ℹ️ Task Assignment Guidelines
          </h5>

          <ul>

            <li>
              Tasks help students gain XP points.
            </li>

            <li>
              Completing tasks increases level and rank.
            </li>

            <li>
              Students receive notifications for new tasks.
            </li>

            <li>
              Use clear and meaningful task titles.
            </li>

          </ul>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center mt-5 text-muted">

        <hr />

        <p>
          © 2026 Campus AI Admin Portal |
          Task Assignment & Progress Tracking
        </p>

      </div>

    </div>

  );

}

export default AssignTask;