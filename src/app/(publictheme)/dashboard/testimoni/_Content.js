"use client";

import Link from "next/link";
import FilePreview from "@/components/ui/FilePreview";
import { useAuthPublic } from "@/providers/auth-public-provider";
import setFotoPublik from "@/utils/setFotoPublik";
import { formatedDate } from "@/utils/formatDate";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

function DisplayBintangNilai(nilai) {
  if (typeof nilai !== "number" || isNaN(nilai) || nilai < 0)
    return <span className="text-sm">Rating tidak valid</span>;

  const maxStars = 5;
  const avg = Math.min(nilai, maxStars); // Batas maksimum 5
  const filledStars = Math.floor(avg);
  const halfStar = avg - filledStars >= 0.5;
  const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="text-warning">
        {Array(filledStars)
          .fill()
          .map((_, i) => (
            <span key={`full-${i}`}>&#9733;</span> // ★
          ))}
        {halfStar && <span key="half">&#189;</span>} {/* ½ */}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <span key={`empty-${i}`}>&#9734;</span> // ☆
          ))}
      </div>
    </div>
  );
}

function TestimoniContent({ data }) {
  const [isLoading, setIsloading] = useState(null);
  const router = useRouter();
  const { userPublik } = useAuthPublic();
  const fotoImage = setFotoPublik(userPublik);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setIsloading(id);
    try {
      const res = await axios.delete(`/api/publik/testimoni/${id}`);
      console.log(res);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsloading(null);
    }
  };

  return (
    <ul className="dashboardListgroup hovereffect">
      {data.map((item, index) => {
        return (
          <li key={index}>
            <div className="singleReviewswrap">
              <div className="singlereviews">
                <div style={{ width: "80px", height: "80px" }}>
                  <FilePreview
                    noLink
                    fileUrl={fotoImage}
                    filename={fotoImage}
                    isUser={true}
                    className="img-fluid circle"
                  />
                </div>

                <div className="reviewsInfo">
                  <div className="reviewssupper d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <div className="reviewsExtopper">
                      <div className="reviewrHeadline d-flex align-items-center justify-content-start gap-2">
                        <h6 className="messageuserTitle">{userPublik?.nama}</h6>
                        {" on "}
                        <Link
                          href={`/form/result?tiket=${item?.tiket}&email=${item?.[item?.jenis]?.email}`}
                          className="fw-medium text-primary"
                        >
                          {item?.jenis?.toUpperCase()} {item?.tiket}
                        </Link>
                      </div>
                      <div className="postedDate">
                        <span className="text-md">
                          {formatedDate(item.created_at, true)}
                        </span>
                      </div>
                    </div>
                    <div className="flxLast">
                      <div className="reviewsStar" data-rating="5">
                        {DisplayBintangNilai(item.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="reviewsBody">
                    <div className="reviewDescription d-block mb-3">
                      <p className="m-0">{item?.komentar}</p>
                    </div>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={Boolean(isLoading)}
                        className="btn btn-sm fw-medium btn-light-primary rounded-pill"
                      >
                        {isLoading === item.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TestimoniContent;
