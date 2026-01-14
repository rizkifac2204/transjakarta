export const viewport = {
  scroll: false,
};

export default function PeraturanLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
