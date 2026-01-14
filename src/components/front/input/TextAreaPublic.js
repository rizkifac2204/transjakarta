"use client";

import React, { forwardRef } from "react";

const TextAreaPublic = forwardRef(
  ({ label, placeholder = "", error, rows = 3, description, ...rest }, ref) => {
    return (
      <div className="form-group form-border">
        {label && <label className="form-label">{label}</label>}

        <textarea
          ref={ref}
          className={`form-control bg-light ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          rows={rows}
          {...rest}
        />

        {error && (
          <div className="invalid-feedback d-block">{error.message}</div>
        )}

        {description && (
          <div className="form-text text-xs text-muted small">
            {description}
          </div>
        )}
      </div>
    );
  }
);

TextAreaPublic.displayName = "TextAreaPublic";
export default TextAreaPublic;
