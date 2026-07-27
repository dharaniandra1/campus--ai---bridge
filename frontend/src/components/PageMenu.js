import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

function PageMenu() {

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
          to="/dashboard"
        >
          🏠 Dashboard
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item
          as={Link}
          to="/student-profile"
        >
          👨‍🎓 Student Profile
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/skill-gap"
        >
          📊 Skill Gap Analysis
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/placement-score"
        >
          📈 Placement Score
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/job-recommendation"
        >
          💼 Job Recommendation
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/ai-eligibility"
        >
          🤖 AI Eligibility
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/resume-analyzer"
        >
          📄 Resume Analyzer
        </Dropdown.Item>

        <Dropdown.Item
          as={Link}
          to="/ai-mock-interview"
        >
          🎤 AI Mock Interview
        </Dropdown.Item>

      </Dropdown.Menu>

    </Dropdown>

  );

}

export default PageMenu;