export const viewport = {
  scroll: false,
};

export default function SliderLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
