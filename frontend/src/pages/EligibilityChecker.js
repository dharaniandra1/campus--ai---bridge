import React, { useState } from "react";

function EligibilityChecker() {

  const [cgpa, setCgpa] = useState("");
  const [companies, setCompanies] = useState([]);

  const checkEligibility = () => {

    let eligible = [];

    if (cgpa >= 6)
      eligible.push("TCS");

    if (cgpa >= 6.5)
      eligible.push("Infosys");

    if (cgpa >= 7)
      eligible.push("Wipro");

    if (cgpa >= 8)
      eligible.push("Amazon");

    setCompanies(eligible);
  };

  return (
    <div className="container mt-4">

      <h2>Placement Eligibility Checker</h2>

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Enter CGPA"
        value={cgpa}
        onChange={(e) =>
          setCgpa(e.target.value)
        }
      />

      <button
        className="btn btn-primary"
        onClick={checkEligibility}
      >
        Check Eligibility
      </button>

      <ul className="mt-4">

        {
          companies.map(
            (company, index) => (
              <li key={index}>
                ✅ {company}
              </li>
            )
          )
        }

      </ul>

    </div>
  );
}

export default EligibilityChecker;