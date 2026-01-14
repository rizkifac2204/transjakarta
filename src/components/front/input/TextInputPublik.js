"use client";

import React, { forwardRef, useState } from "react";
import Icon from "@/components/ui/Icon";

const TextInputPublic = forwardRef(
  (
    {
      type = "text",
      label,
      placeholder = "",
      description,
      hasicon,
      error,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(!open);
    };

    return (
      <div className="form-group form-border">
        {label && <label className="form-label">{label}</label>}

        <div className="position-relative">
          <input
            ref={ref}
            type={type === "password" && open === true ? "text" : type}
            className={`form-control bg-light pe-5 ${
              error ? "is-invalid" : ""
            }`}
            placeholder={placeholder}
            {...rest}
          />

          {hasicon && (
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              onClick={handleOpen}
            >
              {open && type === "password" && (
                <Icon icon="heroicons-outline:eye" />
              )}
              {!open && type === "password" && (
                <Icon icon="heroicons-outline:eye-off" />
              )}
            </span>
          )}
        </div>

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

TextInputPublic.displayName = "TextInputPublic";
export default TextInputPublic;
