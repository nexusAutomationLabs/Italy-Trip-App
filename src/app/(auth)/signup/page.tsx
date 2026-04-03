import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div
      className="relative flex min-h-svh items-center justify-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1744909229894-883bb19b552f?w=1920&q=80&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Auth card */}
      <div className="relative z-10 mx-4 w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-center text-2xl font-heading font-semibold">
              Berwick goes to Tuscany 2026
            </CardTitle>
            <CardDescription className="text-center">
              Join the trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <SignupForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
