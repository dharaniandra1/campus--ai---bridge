import React from "react";

function StatCard({ label, value, tone = "blue" }) {
  return (
    <div className={`metric-card ${tone}`}>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default StatCard;
