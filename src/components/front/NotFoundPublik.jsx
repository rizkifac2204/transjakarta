import Link from "next/link";
import Image from "next/image";

function NotFoundPublik() {
  return (
    <>
      <section className="position-relative">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-12">
              <div className="404-capstion text-center my-4">
                <div className="404-captions mb-5">
                  <Image
                    src="/front/error.png"
                    alt="Error Illustration"
                    width={200}
                    height={200}
                    className="img-fluid"
                    priority
                  />
                  <h2>Halaman Tidak Ditemukan!</h2>
                  <p className="fs-6">
                    Halaman yang Anda cari mungkin telah dihapus karena namanya
                    diubah atau tidak tersedia untuk sementara.
                  </p>
                </div>
                <div className="backHome">
                  <Link
                    href="/"
                    className="btn btn-sm btn-light-primary fw-medium rounded-pill"
                  >
                    Kembali Ke Beranda
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPublik;
