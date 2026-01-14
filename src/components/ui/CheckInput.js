import React, { forwardRef } from "react";
import Image from "next/image";

const CheckInput = forwardRef(
  (
    {
      id,
      disabled,
      label,
      name,
      checked,
      onChange,
      activeClass = "ring-black-500  bg-slate-900 dark:bg-slate-700 dark:ring-slate-700 ",
      ...rest
    },
    ref
  ) => {
    return (
      <label
        className={`flex items-center ${
          disabled ? " cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        id={id}
      >
        <input
          ref={ref}
          type="checkbox"
          className="hidden"
          name={name}
          checked={checked}
          onChange={onChange}
          htmlFor={id}
          disabled={disabled}
          {...rest}
        />
        <span
          className={`h-4 w-4 border flex-none border-slate-100 dark:border-slate-800 rounded inline-flex ltr:mr-3 rtl:ml-3 relative transition-all duration-150
        ${
          checked
            ? activeClass + " ring-2 ring-offset-2 dark:ring-offset-slate-800 "
            : "bg-slate-100 dark:bg-slate-600 dark:border-slate-600"
        }
        `}
        >
          {checked && (
            <Image
              src="/assets/images/ck-white.svg"
              alt=""
              width={10}
              height={10}
              className="block m-auto"
              style={{ height: "10px", width: "10px" }}
            />
          )}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-sm leading-6 capitalize">
          {label}
        </span>
      </label>
    );
  }
);

CheckInput.displayName = "CheckInput";

export default CheckInput;
