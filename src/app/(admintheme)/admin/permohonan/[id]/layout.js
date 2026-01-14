export const viewport = {
  scroll: false,
};

export default function PermohonanLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
