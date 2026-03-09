import Card, { CardContent } from '../ui/Card'

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Before ImpactLedger, I spent 8 hours creating Form 10BD. Now it takes 10 minutes. I can focus on what matters — serving my community.",
      name: 'Priya Sharma',
      role: 'NGO Administrator, Maharashtra',
      avatar: '👩‍💼',
    },
    {
      quote: "The semantic search completely changed how we discover NGOs. We found a water conservation project that perfectly matched our CSR goals — one we would have never found on traditional platforms.",
      name: 'Rajesh Mehta',
      role: 'CSR Head, Fortune 500',
      avatar: '👨‍💼',
    },
    {
      quote: "I can now enter data in Marathi using my voice. No more struggling with English forms. ImpactLedger truly understands rural India.",
      name: 'Sunita Pawar',
      role: 'Field Worker, Satara',
      avatar: '👩‍🌾',
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Voices from the Field
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card key={t.name} hover>
              <CardContent className="p-8 space-y-6">

                {/* Star rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-secondary text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-text-secondary leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{t.name}</p>
                    <p className="text-sm text-text-muted">{t.role}</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}