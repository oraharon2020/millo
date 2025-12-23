import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactWidget from "@/components/ContactWidget";
import AccessibilityWidget from "@/components/AccessibilityWidget";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ContactWidget />
      <AccessibilityWidget />
    </>
  );
}
