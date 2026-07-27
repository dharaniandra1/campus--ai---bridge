import React from "react";

function ResultList({ title, items }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      {items?.length ? (
        <ul className="result-list">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">No items returned yet.</p>
      )}
    </div>
  );
}

export default ResultList;
