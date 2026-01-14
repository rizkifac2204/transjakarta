import FooterTop from "@/components/front/FooterTop";
import Footer from "@/components/front/Footer";

export default function WithFooterLayout({ children }) {
  return (
    <>
      <div style={{ minHeight: "400px" }}>{children}</div>
      <FooterTop />
      <Footer />
    </>
  );
}
