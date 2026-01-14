import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Icon from "@/components/ui/Icon";
import "react-datepicker/dist/react-datepicker.css";

const DateInputPublic = ({
  control,
  rules,
  label,
  placeholder = "",
  classLabel = "form-label",
  className = "",
  classGroup = "",
  error,
  icon,
  id,
  name,
  horizontal,
  validate,
  msgTooltip,
  description,

  ...rest
}) => {
  return (
    <div className="form-group form-border">
      {label && <label className="form-label">{label}</label>}

      <div className={`position-relative`}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <DatePicker
              placeholderText={placeholder}
              selected={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              dateFormat="yyyy-MM-dd"
              className={`form-control bg-light pe-5 w-100 ${
                error ? "is-invalid" : ""
              }`}
              isClearable
            />
          )}
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

      {error && <div className="invalid-feedback d-block">{error.message}</div>}

      {description && (
        <div className="form-text text-xs text-muted small">{description}</div>
      )}
    </div>
  );
};

DateInputPublic.displayName = "DateInputPublic";
export default DateInputPublic;
