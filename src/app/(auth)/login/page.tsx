import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
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
            <CardTitle className="text-center text-xl font-bold">
              Berwick, NS does Tuscany 2026
            </CardTitle>
            <CardDescription className="text-center">
              Welcome back
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
