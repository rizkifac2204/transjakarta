const DetailRow = ({ label, value }) => {
  return (
    <div className="row border-bottom py-2">
      <div className="col-5 text-secondary">{label}</div>
      <div className="col-7 text-end">{value || "-"}</div>
    </div>
  );
};

DetailRow.displayName = "DetailRow";
export default DetailRow;
