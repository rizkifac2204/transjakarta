export const viewport = {
  scroll: false,
};

export default function LaporanLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
