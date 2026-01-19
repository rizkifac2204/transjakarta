export const viewport = {
  scroll: false,
};

export default function Layout({ children, modalShelter }) {
  return (
    <>
      {modalShelter}
      {children}
    </>
  );
}
