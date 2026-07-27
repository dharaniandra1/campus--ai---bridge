import React, { useState } from "react";
import API from "../services/api";
import AdminMenu from "../components/AdminMenu";

function AddStudent() {

  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });

  };

  const addStudent = async () => {

    if (
      !student.name ||
      !student.email ||
      !student.password
    ) {

      alert("Please fill all fields");
      return;

    }

    try {

      await API.post(
        "/auth/register",
        {
          ...student,
          role: "student"
        }
      );

      alert("Student Added Successfully");

      setStudent({
        name: "",
        email: "",
        password: ""
      });

    } catch (error) {

      console.log(error);

      alert("Failed To Add Student");

    }

  };

  const clearForm = () => {

    setStudent({
      name: "",
      email: "",
      password: ""
    });

  };

  return (

    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            ➕ Add Student
          </h2>

          <p className="text-muted">
            Register a new student into Campus AI Platform
          </p>

        </div>

        <AdminMenu />

      </div>

      {/* Registration Form */}

      <div className="card shadow">

        <div className="card-body">

          <h4 className="mb-4">
            Student Registration Form
          </h4>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Student Name"
            name="name"
            value={student.name}
            onChange={handleChange}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Student Email"
            name="email"
            value={student.email}
            onChange={handleChange}
          />

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Password"
            name="password"
            value={student.password}
            onChange={handleChange}
          />

          <div className="d-flex gap-2">

            <button
              className="btn btn-primary"
              onClick={addStudent}
            >
              Add Student
            </button>

            <button
              className="btn btn-secondary"
              onClick={clearForm}
            >
              Clear
            </button>

          </div>

        </div>

      </div>

      {/* Info Card */}

      <div className="card shadow mt-4">

        <div className="card-body">

          <h5>
            ℹ️ Information
          </h5>

          <ul>
            <li>Student account will be created.</li>
            <li>Role will automatically be assigned as Student.</li>
            <li>Student can login using Email & Password.</li>
          </ul>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center mt-5 text-muted">

        <hr />

        <p>
          © 2026 Campus AI Admin Portal |
          Student Registration System
        </p>

      </div>

    </div>

  );

}

export default AddStudent;