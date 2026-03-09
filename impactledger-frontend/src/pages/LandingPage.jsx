import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import ProblemSection from '@/components/landing/ProblemSection'
import HowItWorks from '@/components/landing/HowItWorks'
import FeaturesSection from '@/components/landing/FeaturesSection'
import StatsSection from '@/components/landing/StatsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}