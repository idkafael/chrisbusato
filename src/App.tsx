import HeroSection from './components/HeroSection'
import CTASection from './components/CTASection'
import LinksSection from './components/LinksSection'
import TestimonialsSection from './components/TestimonialsSection'
import ClosingSection from './components/ClosingSection'

function App() {
  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-[480px] relative">
        <HeroSection />
        <CTASection />
        <LinksSection />
        <TestimonialsSection />
        <ClosingSection />
      </div>
    </div>
  )
}

export default App
