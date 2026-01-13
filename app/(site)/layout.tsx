import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactWidget from "@/components/ContactWidget";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AdminBar from "@/components/AdminBar";
import AdminBarSpacer from "@/components/AdminBarSpacer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminBar />
      <AdminBarSpacer />
      <Header />
      {children}
      <Footer />
      <ContactWidget />
      <AccessibilityWidget />
    </>
  );
}
