import { Suspense } from 'react'
import { SignupForm } from '@/components/auth/SignupForm'

const TUSCANY_IMAGE_URL =
  'https://images.unsplash.com/photo-1568930155292-e82d9e298a2a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0'

export default function SignupPage() {
  return (
    <div className="min-h-svh flex flex-col lg:grid lg:grid-cols-2">
      {/* Left / top: Tuscany photo */}
      <div className="relative h-[200px] lg:h-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${TUSCANY_IMAGE_URL})` }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        {/* Text overlay */}
        <div className="absolute bottom-8 left-8 right-8 lg:bottom-12">
          <p className="font-heading text-3xl lg:text-4xl italic font-bold leading-snug text-white">
            Berwick goes to Tuscany 2026
          </p>
          <p className="mt-1 text-[14px] text-white/80">May 7 - 16, 2026</p>
        </div>
      </div>

      {/* Right / bottom: Form section */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-10 lg:py-0">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold italic text-foreground">Join the Trip</h1>
          <p className="mt-2 mb-8 text-muted-foreground text-sm">Create an account to start planning with the group.</p>
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
