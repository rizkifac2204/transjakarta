"use client";

import React, { forwardRef } from "react";

const SelectInputPublic = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = "-- Pilih --",
      description,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="form-group form-border">
        {label && <label className="form-label">{label}</label>}

        <select
          ref={ref}
          className={`form-control bg-light ${error ? "is-invalid" : ""}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, index) =>
            typeof opt === "string" ? (
              <option key={index} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>

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

SelectInputPublic.displayName = "SelectInputPublic";
export default SelectInputPublic;
