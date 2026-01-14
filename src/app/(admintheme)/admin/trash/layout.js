export const viewport = {
  scroll: false,
};

export default function TrashLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
