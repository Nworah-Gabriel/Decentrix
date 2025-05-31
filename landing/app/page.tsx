// Make sure the path is correct; if the file is named Navigation.tsx, use:
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { HeroSection } from "../components/hero-section"
import { FeaturesSection } from "../components/features-section"
import { CTASection } from "../components/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
