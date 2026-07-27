import React from "react";

function EmptyState({ title = "Nothing to show yet", text }) {
  return (
    <div className="empty-state">
      <h4>{title}</h4>
      {text && <p>{text}</p>}
    </div>
  );
}

export default EmptyState;
