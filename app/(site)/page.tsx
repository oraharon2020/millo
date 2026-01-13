import Hero from "@/components/Hero";
import KitchenStyles from "@/components/KitchenStyles";
// import DesignedForYou from "@/components/DesignedForYou"; // Hidden temporarily
import KitchenShowcase from "@/components/KitchenShowcase";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";
import NiceToMillo from "@/components/NiceToMillo";
import KitchenInsights from "@/components/KitchenInsights";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <KitchenStyles />
      <NotOnlyKitchens />
      <KitchenShowcase />
      <NiceToMillo />
      <CTASection />
      <KitchenInsights />
    </main>
  );
}
