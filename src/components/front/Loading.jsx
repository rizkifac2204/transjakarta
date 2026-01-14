import React from "react";

function LoadingPublik() {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "1.5rem", height: "1.5rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="fw-medium">Memuat Data ...</span>
    </div>
  );
}

export default LoadingPublik;
