export const viewport = {
  scroll: false,
};

export default function DipLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
