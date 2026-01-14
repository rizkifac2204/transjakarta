import React, { Fragment, forwardRef } from "react";
import Icon from "@/components/ui/Icon";

const Select = forwardRef(
  (
    {
      label,
      placeholder = "Select Option",
      classLabel = "form-label",
      className = "",
      classGroup = "",
      name,
      readonly,
      value,
      error,
      icon,
      disabled,
      id,
      horizontal,
      validate,
      msgTooltip,
      description,
      onChange,
      options = Array(3).fill("option"),
      defaultValue,
      size,
      ...rest
    },
    ref
  ) => {
    const selectElement = (
      <select
        ref={ref}
        onChange={onChange}
        name={name}
        {...rest}
        className={`${
          error ? " has-error" : ""
        } form-control py-2 appearance-none ${className}`}
        placeholder={placeholder}
        readOnly={readonly}
        disabled={disabled}
        id={id}
        value={value}
        size={size}
        defaultValue={defaultValue}
      >
        <option value="">{placeholder}</option>
        {options.map((option, i) => (
          <Fragment key={i}>
            {option?.value && option?.label ? (
              <option value={option.value}>{option.label}</option>
            ) : (
              <option value={option}>{option}</option>
            )}
          </Fragment>
        ))}
      </select>
    );

    return (
      <div
        className={`fromGroup ${error ? "has-error" : ""} ${
          horizontal ? "flex" : ""
        } ${validate ? "is-valid" : ""} ${classGroup}`}
      >
        {label && (
          <label
            htmlFor={id}
            className={`mb-1 block capitalize ${classLabel} ${
              horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
            }`}
          >
            {label}
          </label>
        )}

        <div className={`relative ${horizontal ? "flex-1" : ""}`}>
          {selectElement}

          {/* icon */}
          <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
            <span className="relative -right-2 inline-block text-slate-900 dark:text-slate-300 pointer-events-none">
              <Icon icon="heroicons:chevron-down" />
            </span>
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

        {/* error and success message*/}
        {error && (
          <div
            className={`${
              msgTooltip
                ? "inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
                : "text-danger-500 block text-sm"
            }`}
          >
            {error.message}
          </div>
        )}

        {validate && (
          <div
            className={`${
              msgTooltip
                ? "inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded"
                : "text-success-500 block text-sm"
            }`}
          >
            {validate}
          </div>
        )}

        {description && (
          <span className="input-description mt-1">{description}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select"; // penting untuk debugging komponen forwardRef

export default Select;
