import React, { useState, forwardRef } from "react";

import Icon from "./Icon";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
const Textinput = forwardRef(
  (
    {
      type,
      label,
      placeholder = "",
      classLabel = "form-label",
      className = "",
      classGroup = "",
      error,
      icon,
      id,
      horizontal,
      validate,
      msgTooltip,
      description,
      hasicon,
      options,
      isMask,
      suffix,

      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(!open);
    };

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
          {!isMask && (
            <input
              type={type === "password" && open === true ? "text" : type}
              ref={ref}
              {...rest}
              className={`${
                error ? " has-error" : " "
              } form-control py-2 ${className}  `}
              placeholder={placeholder}
              id={id}
            />
          )}
          {isMask && (
            <Cleave
              ref={ref}
              {...rest}
              placeholder={placeholder}
              options={options}
              className={`${
                error ? " has-error" : " "
              } form-control py-2 ${className}  `}
              id={id}
            />
          )}

          {/* icon */}
          <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2  space-x-1 rtl:space-x-reverse">
            {hasicon && (
              <span
                className="cursor-pointer text-secondary-500"
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
                ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
                : " text-danger-500 block text-sm"
            }`}
          >
            {error.message}
          </div>
        )}

        {/* validated and success message*/}
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

        {/* only description */}
        {description && (
          <span className="input-description">{description}</span>
        )}
      </div>
    );
  }
);

Textinput.displayName = "Textinput";
export default Textinput;
