import Hero from "../components/landing/Hero";
import ExploreSection from "../components/landing/ExploreSection";
import VetSection from "../components/landing/VetSection";
import ProductsSection from "../components/landing/ProductsSection";
import AdoptionSection from "../components/landing/AdoptionSection";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ExploreSection />
        <VetSection />
        <ProductsSection />
        <AdoptionSection />
      </main>

      <Footer />
    </>
  );
}
