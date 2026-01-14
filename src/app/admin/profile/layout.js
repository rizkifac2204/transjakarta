export const viewport = {
  scroll: false,
};

export default function ProfileLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
