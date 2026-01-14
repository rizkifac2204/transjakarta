import React, { forwardRef } from "react";
import Icon from "@/components/ui/Icon";

const Textarea = forwardRef(
  (
    {
      label,
      placeholder,
      classLabel = "form-label",
      className = "",
      classGroup = "",
      name,
      readonly,
      error,
      icon,
      disabled,
      id,
      horizontal,
      validate,
      msgTooltip,
      description,
      cols,
      row = 3,
      onChange,

      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={`fromGroup  ${error ? "has-error" : ""}  ${
          horizontal ? "flex" : ""
        }  ${validate ? "is-valid" : ""} `}
      >
        {label && (
          <label
            htmlFor={id}
            className={`mb-1 block capitalize ${classLabel}  ${
              horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
            }`}
          >
            {label}
          </label>
        )}

        <div className={`relative ${horizontal ? "flex-1" : ""}`}>
          <textarea
            ref={ref}
            id={id}
            name={name}
            placeholder={placeholder}
            {...rest}
            className={`${
              error ? " has-error" : " "
            } form-control py-2 ${className}  `}
            readOnly={readonly}
            disabled={disabled}
            cols={cols}
            rows={row}
            onChange={onChange}
            value={rest.value}
          />

          <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2  space-x-1 rtl:space-x-reverse">
            {error && (
              <span className="text-danger-500">
                <Icon icon="heroicons-outline:information-circle" />
              </span>
            )}
            {validate && (
              <span className="text-success-500">
                <Icon icon="bi:check-lg" />
              </span>
            )}
          </div>
        </div>

        {error && (
          <div
            className={`${
              msgTooltip
                ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
                : " text-danger-500 block text-sm"
            }`}
          >
            {error.message}
          </div>
        )}

        {validate && (
          <div
            className={`${
              msgTooltip
                ? " inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded"
                : " text-success-500 block text-sm"
            }`}
          >
            {validate}
          </div>
        )}

        {description && (
          <span className="input-description">{description}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
