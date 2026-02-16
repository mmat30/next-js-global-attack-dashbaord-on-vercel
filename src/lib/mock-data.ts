import type {
  Attack,
  AttackType,
  GeoLocation,
  SeverityLevel,
  ThreatStatus,
} from "./types"

const LOCATIONS: GeoLocation[] = [
  { lat: 39.9, lng: 116.4, city: "Beijing", country: "China", countryCode: "CN" },
  { lat: 55.75, lng: 37.62, city: "Moscow", country: "Russia", countryCode: "RU" },
  { lat: 37.57, lng: 126.98, city: "Seoul", country: "South Korea", countryCode: "KR" },
  { lat: 38.9, lng: -77.04, city: "Washington", country: "United States", countryCode: "US" },
  { lat: 51.51, lng: -0.13, city: "London", country: "United Kingdom", countryCode: "GB" },
  { lat: 48.86, lng: 2.35, city: "Paris", country: "France", countryCode: "FR" },
  { lat: 52.52, lng: 13.41, city: "Berlin", country: "Germany", countryCode: "DE" },
  { lat: 35.68, lng: 139.69, city: "Tokyo", country: "Japan", countryCode: "JP" },
  { lat: -23.55, lng: -46.63, city: "São Paulo", country: "Brazil", countryCode: "BR" },
  { lat: 28.61, lng: 77.21, city: "New Delhi", country: "India", countryCode: "IN" },
  { lat: 1.35, lng: 103.82, city: "Singapore", country: "Singapore", countryCode: "SG" },
  { lat: -33.87, lng: 151.21, city: "Sydney", country: "Australia", countryCode: "AU" },
  { lat: 41.01, lng: 28.98, city: "Istanbul", country: "Turkey", countryCode: "TR" },
  { lat: 25.2, lng: 55.27, city: "Dubai", country: "UAE", countryCode: "AE" },
  { lat: 37.77, lng: -122.42, city: "San Francisco", country: "United States", countryCode: "US" },
  { lat: 19.43, lng: -99.13, city: "Mexico City", country: "Mexico", countryCode: "MX" },
  { lat: 59.33, lng: 18.07, city: "Stockholm", country: "Sweden", countryCode: "SE" },
  { lat: 50.45, lng: 30.52, city: "Kyiv", country: "Ukraine", countryCode: "UA" },
  { lat: 35.69, lng: 51.39, city: "Tehran", country: "Iran", countryCode: "IR" },
  { lat: 6.52, lng: 3.38, city: "Lagos", country: "Nigeria", countryCode: "NG" },
]

const ATTACK_TYPES: AttackType[] = [
  "ddos", "brute-force", "sql-injection", "xss", "phishing",
  "ransomware", "zero-day", "port-scan", "man-in-the-middle",
]

const SEVERITY_LEVELS: SeverityLevel[] = [
  "critical", "high", "medium", "low", "info",
]

const SEVERITY_WEIGHTS = [0.05, 0.15, 0.35, 0.3, 0.15]

const PROTOCOLS = ["TCP", "UDP", "HTTP", "HTTPS", "SSH", "FTP", "DNS", "SMTP"]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pickWeighted<T>(items: T[], weights: number[], rand: () => number): T {
  const r = rand()
  let cumulative = 0
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i]
    if (r <= cumulative) return items[i]
  }
  return items[items.length - 1]
}

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)]
}

export function generateAttack(id: string, rand: () => number): Attack {
  const source = pick(LOCATIONS, rand)
  let target = pick(LOCATIONS, rand)
  while (target.countryCode === source.countryCode) {
    target = pick(LOCATIONS, rand)
  }

  return {
    id,
    timestamp: new Date(Date.now() - Math.floor(rand() * 3600000)),
    type: pick(ATTACK_TYPES, rand),
    severity: pickWeighted(SEVERITY_LEVELS, SEVERITY_WEIGHTS, rand),
    source,
    target,
    protocol: pick(PROTOCOLS, rand),
    port: Math.floor(rand() * 65535),
  }
}

export function generateAttacks(count: number, seed = 42): Attack[] {
  const rand = seededRandom(seed)
  return Array.from({ length: count }, (_, i) => generateAttack(`atk-${i}`, rand))
}

export function generateThreatStatus(seed = 42): ThreatStatus {
  const rand = seededRandom(seed + 100)
  return {
    level: "elevated",
    attacksPerMinute: Math.floor(rand() * 800 + 200),
    activeIncidents: Math.floor(rand() * 50 + 10),
    topAttackType: "ddos",
  }
}

export interface CountryAttackStat {
  country: string
  countryCode: string
  attacks: number
}

export function generateTopTargetedCountries(seed = 42): CountryAttackStat[] {
  const rand = seededRandom(seed + 200)
  const countries = [
    { country: "United States", countryCode: "US" },
    { country: "United Kingdom", countryCode: "GB" },
    { country: "Germany", countryCode: "DE" },
    { country: "Japan", countryCode: "JP" },
    { country: "France", countryCode: "FR" },
    { country: "Australia", countryCode: "AU" },
    { country: "South Korea", countryCode: "KR" },
    { country: "Singapore", countryCode: "SG" },
  ]

  return countries
    .map((c) => ({ ...c, attacks: Math.floor(rand() * 5000 + 500) }))
    .sort((a, b) => b.attacks - a.attacks)
}

export interface AttackTypeStat {
  type: AttackType
  count: number
}

export function generateAttackTypeBreakdown(seed = 42): AttackTypeStat[] {
  const rand = seededRandom(seed + 300)
  return ATTACK_TYPES.map((type) => ({
    type,
    count: Math.floor(rand() * 3000 + 100),
  })).sort((a, b) => b.count - a.count)
}

export interface TimelinePoint {
  time: string
  attacks: number
  blocked: number
}

export function generateTimeline(seed = 42): TimelinePoint[] {
  const rand = seededRandom(seed + 400)
  const points: TimelinePoint[] = []
  for (let h = 0; h < 24; h++) {
    const hour = h.toString().padStart(2, "0") + ":00"
    const attacks = Math.floor(rand() * 400 + 100)
    points.push({
      time: hour,
      attacks,
      blocked: Math.floor(attacks * (0.6 + rand() * 0.3)),
    })
  }
  return points
}
