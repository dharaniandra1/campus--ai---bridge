import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

function AdminMenu() {

  return (

    <Dropdown align="end">

      <Dropdown.Toggle
        variant="dark"
        size="sm"
      >
        ⋮
      </Dropdown.Toggle>

      <Dropdown.Menu>

        <Dropdown.Item
          as={Link}
          to="/admin-dashboard"
        >
          🏠 Admin Dashboard
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item
          as={Link}
          to="/add-student"
        >
          ➕ Add Student
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/view-students"
        >
          👨‍🎓 View Students
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/assign-task"
        >
          📋 Assign Task
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/leaderboard"
        >
          🏆 Leaderboard
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/analytics"
        >
          📊 Analytics
        </Dropdown.Item>

      </Dropdown.Menu>

    </Dropdown>

  );

}

export default AdminMenu;