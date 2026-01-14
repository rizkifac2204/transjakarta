export default function Loading() {
  return (
    <div
      data-scroll="false"
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backdropFilter: "blur(2px)", // efek blur
        WebkitBackdropFilter: "blur(2px)", // untuk Safari
        zIndex: 1050,
      }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
