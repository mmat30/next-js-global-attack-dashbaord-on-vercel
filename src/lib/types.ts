export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info"

export type AttackType =
  | "ddos"
  | "brute-force"
  | "sql-injection"
  | "xss"
  | "phishing"
  | "ransomware"
  | "zero-day"
  | "port-scan"
  | "man-in-the-middle"

export type ThreatLevel = "critical" | "elevated" | "guarded" | "low"

export interface GeoLocation {
  lat: number
  lng: number
  city?: string
  country: string
  countryCode: string
}

export interface Attack {
  id: string
  timestamp: Date
  type: AttackType
  severity: SeverityLevel
  source: GeoLocation
  target: GeoLocation
  protocol?: string
  port?: number
}

export interface ThreatStatus {
  level: ThreatLevel
  attacksPerMinute: number
  activeIncidents: number
  topAttackType: AttackType
}
