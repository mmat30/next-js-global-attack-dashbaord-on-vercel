import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { CountryAttackStat } from "@/lib/mock-data"

interface TopTargetedCountriesProps {
  countries: CountryAttackStat[]
}

export function TopTargetedCountries({ countries }: TopTargetedCountriesProps) {
  const maxAttacks = (countries[0]?.attacks || 1)

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Top Targeted Countries
        </CardTitle>
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {countries.map((c, i) => (
            <div key={c.countryCode} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-4 text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="font-medium">{c.country}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {c.attacks.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${(c.attacks / maxAttacks) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
