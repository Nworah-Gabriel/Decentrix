import { Navigation } from "./components/Navigation"
import { Footer } from "./components/Footer"
import { HeroSection } from "./components/HeroSection"
import { FeaturesSection } from "./components/FeaturesSection"
import { CTASection } from "./components/CTASection"

function App() {
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

export default App
