import DatePicker from "react-datepicker";
import Icon from "../Icon";
import "react-datepicker/dist/react-datepicker.css";

const DateRangeInput = ({
  label,
  placeholder = "",
  range,
  setRange,
  name = "date-range",
  error,
  validate,
  horizontal,
  description,
}) => {
  return (
    <div
      className={`formGroup ${error ? "has-error" : ""} ${
        horizontal ? "flex items-center gap-4" : "flex flex-col"
      } ${validate ? "is-valid" : ""}`}
    >
      {label && (
        <label
          htmlFor={name}
          className={`block capitalize form-label ${
            horizontal ? "w-[120px]" : ""
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <DatePicker
          id={name}
          selectsRange
          startDate={range[0]}
          endDate={range[1]}
          onChange={(dates) => setRange(dates)}
          placeholderText={placeholder}
          dateFormat="yyyy-MM-dd"
          className={`form-control w-full py-2 ${error ? "border-red-500" : ""}`}
          isClearable
          autoComplete="off"
        />

        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-xl">
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

      {error && <p className="text-sm text-danger-500 mt-1">{error}</p>}
      {validate && <p className="text-sm text-success-500 mt-1">{validate}</p>}
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default DateRangeInput;
