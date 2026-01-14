"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ModalPublik({ children }) {
  const router = useRouter();

  // close modal dengan back()
  const close = () => router.back();

  // disable scroll di body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-md"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header border-0 p-3">
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => router.back()}
            />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
