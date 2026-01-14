const DetailRow = ({
  label,
  value,
  horizontal = true,
  description,
  classValue,
}) => {
  return (
    <div
      className={`fromGroup  ${horizontal ? "flex items-start gap-2" : ""} `}
    >
      <label
        className={`block capitalize form-label ${
          horizontal ? "flex-0 mr-6 md:w-[180px] w-[60px] break-words" : ""
        }`}
      >
        {label}
      </label>
      <div className="flex-1 flex flex-col">
        <div className="inline-flex">
          <span className="mr-1">:</span>
          <span className={classValue}>{value || "-"}</span>
        </div>
        {description && (
          <span className="input-description mt-1">{description}</span>
        )}
      </div>
    </div>
  );
};

DetailRow.displayName = "DetailRow";
export default DetailRow;
