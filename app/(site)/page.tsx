import Hero from "@/components/Hero";
import KitchenStyles from "@/components/KitchenStyles";
// import DesignedForYou from "@/components/DesignedForYou"; // Hidden temporarily
import KitchenShowcase from "@/components/KitchenShowcase";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";
import NiceToMillo from "@/components/NiceToMillo";
import KitchenInsights from "@/components/KitchenInsights";
import CTASection from "@/components/CTASection";
import { getHomepageData } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { hero, kitchenStyles, categories, insights, settings } = await getHomepageData();

  return (
    <main className="min-h-screen">
      <Hero data={hero} />
      <KitchenStyles data={kitchenStyles} />
      <NotOnlyKitchens data={categories} />
      <KitchenShowcase data={kitchenStyles} />
      <NiceToMillo data={settings} />
      <CTASection />
      <KitchenInsights data={insights} />
    </main>
  );
}
