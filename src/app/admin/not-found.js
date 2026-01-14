import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900">
      <div className="max-w-[546px] mx-auto w-full">
        <h4 className="text-slate-900 mb-4">Halaman/Data Tidak Ditemukan</h4>
        <div className="dark:text-white text-base font-normal mb-10">
          Halaman yang kamu tuju mungkin tidak tersedia atau data tidak
          ditemukan pada server kami
        </div>
      </div>
      <div className="max-w-[300px] mx-auto w-full">
        <Link
          href="/admin"
          className="btn bg-white hover:bg-opacity-75 transition-all duration-150 block text-center text-black-500"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
