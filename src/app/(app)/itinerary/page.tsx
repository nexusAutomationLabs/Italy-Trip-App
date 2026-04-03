import { differenceInCalendarDays } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ItineraryPage() {
  const tripStart = new Date('2026-05-07')
  const today = new Date()
  const daysUntil = differenceInCalendarDays(tripStart, today)

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <div
        className="relative w-full min-h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80)',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-4">
          {daysUntil > 0 ? (
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
              {daysUntil} days until Tuscany!
            </h1>
          ) : daysUntil === 0 ? (
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
              It&apos;s Tuscany day!
            </h1>
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
              We made it to Tuscany!
            </h1>
          )}
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow">
            May 7 – 16, 2026 &nbsp;|&nbsp; Florence, Italy
          </p>
        </div>
      </div>

      {/* Welcome card */}
      <div className="flex justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Welcome to the trip planner!</CardTitle>
            <CardDescription>Berwick, NS does Tuscany 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The itinerary is being built. Check back soon for day-by-day
              plans — excursions, dinners, and everything in between.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
