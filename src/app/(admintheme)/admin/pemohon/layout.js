export const viewport = {
  scroll: false,
};

export default function PemohonLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
