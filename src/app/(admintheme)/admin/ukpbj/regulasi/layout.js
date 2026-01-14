export const viewport = {
  scroll: false,
};

export default function UkpbjRegulasiLayout({ children, modal }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
