"use client";

import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Icon from "./Icon";
import "react-datepicker/dist/react-datepicker.css";

const TimeInputController = ({
  control,
  name,
  label,
  classLabel = "form-label",
  placeholder,
  error,
  id,
  horizontal,
  validate,
  ...rest
}) => {
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
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePicker
              id={name}
              placeholderText={placeholder}
              className="form-control"
              onChange={onChange}
              onBlur={onBlur}
              selected={value}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Waktu"
              dateFormat="HH:mm"
              autoComplete="off"
              {...rest}
            />
          )}
        />
      </div>
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
  );
};

export default TimeInputController;
