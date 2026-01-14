import Icon from "@/components/ui/Icon";
import { getInstansi } from "@/libs/instansi";
export const revalidate = 86400;

async function PublikLokasiKontak() {
  const data = await getInstansi();

  return (
    <section
      className="bg-cover position-relative"
      style={{ backgroundImage: `url('/front/main.jpg')` }}
      data-overlay="8"
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-9 col-md-12">
            <div className="fpc-capstion text-center my-4">
              <div className="fpc-captions">
                <h1 className="xl-heading text-light">Hubungi Kami</h1>
                <p className="text-lg text-light">
                  Pengajuan informasi publik dapat dilakukan melalui berbagai
                  saluran komunikasi yang telah disediakan oleh PPID KP2MI.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-between g-4 mt-lg-5 mt-4">
          <div className="col-xl-4 col-lg-4 col-md-6">
            <div className="card p-4 rounded-4 bg-transparents border-0 text-center h-100">
              <div className="crds-icons d-inline-flex mx-auto mb-3 text-light fs-2">
                <Icon icon="fontisto:email" width="40" height="40" />
              </div>
              <div className="crds-desc">
                <h5 className="text-light">Email</h5>
                <p className="fs-6 text-md lh-2 text-light opacity-75 mb-0">
                  {data?.email || "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6">
            <div className="card p-4 rounded-4 bg-transparents border-0 text-center h-100">
              <div className="crds-icons d-inline-flex mx-auto mb-3 text-light fs-2">
                <Icon icon="streamline:web-solid" width="40" height="40" />
              </div>
              <div className="crds-desc">
                <h5 className="text-light">Website</h5>
                <p className="fs-6 text-md lh-2 text-light opacity-75 mb-0">
                  {data?.website || "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6">
            <div className="card p-4 rounded-4 bg-transparents border-0 text-center h-100">
              <div className="crds-icons d-inline-flex mx-auto mb-3 text-light fs-2">
                <Icon icon="et:map-pin" width="40" height="40" />
              </div>
              <div className="crds-desc">
                <h5 className="text-light">Layanan PPID KP2MI</h5>
                <p className="text-md text-light opacity-75 lh-2">
                  {data?.alamat || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublikLokasiKontak;
