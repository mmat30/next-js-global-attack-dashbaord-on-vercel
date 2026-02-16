import {
  generateAttack,
  generateAttacks,
  generateThreatStatus,
  generateTopTargetedCountries,
  generateAttackTypeBreakdown,
  generateTimeline,
  type CountryAttackStat,
  type AttackTypeStat,
  type TimelinePoint,
} from "../mock-data"
import type { Attack } from "../types"

describe("Mock Data Generators", () => {
  describe("generateAttack", () => {
    it("should generate a valid attack object", () => {
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(attack).toHaveProperty("id", "test-id")
      expect(attack).toHaveProperty("timestamp")
      expect(attack.timestamp).toBeInstanceOf(Date)
      expect(attack).toHaveProperty("type")
      expect(attack).toHaveProperty("severity")
      expect(attack).toHaveProperty("source")
      expect(attack).toHaveProperty("target")
      expect(attack).toHaveProperty("protocol")
      expect(attack).toHaveProperty("port")
    })

    it("should generate different source and target countries", () => {
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(attack.source.countryCode).not.toBe(attack.target.countryCode)
    })

    it("should generate valid severity levels", () => {
      const validSeverities = ["critical", "high", "medium", "low", "info"]
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(validSeverities).toContain(attack.severity)
    })

    it("should generate valid attack types", () => {
      const validTypes = [
        "ddos",
        "brute-force",
        "sql-injection",
        "xss",
        "phishing",
        "ransomware",
        "zero-day",
        "port-scan",
        "man-in-the-middle",
      ]
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(validTypes).toContain(attack.type)
    })

    it("should generate valid port numbers (0-65534)", () => {
      const rand = () => 0.9999
      const attack = generateAttack("test-id", rand)

      expect(attack.port).toBeGreaterThanOrEqual(0)
      expect(attack.port).toBeLessThan(65535)
    })

    it("should generate valid protocols", () => {
      const validProtocols = ["TCP", "UDP", "HTTP", "HTTPS", "SSH", "FTP", "DNS", "SMTP"]
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(validProtocols).toContain(attack.protocol)
    })

    it("should generate timestamp within last hour", () => {
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)
      const hourAgo = Date.now() - 3600000
      const now = Date.now()

      expect(attack.timestamp.getTime()).toBeGreaterThanOrEqual(hourAgo)
      expect(attack.timestamp.getTime()).toBeLessThanOrEqual(now)
    })

    it("should have valid geo location structure for source", () => {
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(attack.source).toHaveProperty("lat")
      expect(attack.source).toHaveProperty("lng")
      expect(attack.source).toHaveProperty("country")
      expect(attack.source).toHaveProperty("countryCode")
      expect(typeof attack.source.lat).toBe("number")
      expect(typeof attack.source.lng).toBe("number")
      expect(typeof attack.source.country).toBe("string")
      expect(typeof attack.source.countryCode).toBe("string")
    })

    it("should have valid geo location structure for target", () => {
      const rand = () => 0.5
      const attack = generateAttack("test-id", rand)

      expect(attack.target).toHaveProperty("lat")
      expect(attack.target).toHaveProperty("lng")
      expect(attack.target).toHaveProperty("country")
      expect(attack.target).toHaveProperty("countryCode")
      expect(typeof attack.target.lat).toBe("number")
      expect(typeof attack.target.lng).toBe("number")
      expect(typeof attack.target.country).toBe("string")
      expect(typeof attack.target.countryCode).toBe("string")
    })
  })

  describe("generateAttacks", () => {
    it("should generate the correct number of attacks", () => {
      const attacks = generateAttacks(10)
      expect(attacks).toHaveLength(10)
    })

    it("should generate zero attacks when count is 0", () => {
      const attacks = generateAttacks(0)
      expect(attacks).toHaveLength(0)
    })

    it("should generate unique IDs for each attack", () => {
      const attacks = generateAttacks(100)
      const ids = attacks.map((a) => a.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(100)
    })

    it("should generate attacks with sequential IDs (atk-0, atk-1, etc.)", () => {
      const attacks = generateAttacks(5)

      expect(attacks[0].id).toBe("atk-0")
      expect(attacks[1].id).toBe("atk-1")
      expect(attacks[2].id).toBe("atk-2")
      expect(attacks[3].id).toBe("atk-3")
      expect(attacks[4].id).toBe("atk-4")
    })

    it("should be deterministic with same seed", () => {
      const attacks1 = generateAttacks(10, 42)
      const attacks2 = generateAttacks(10, 42)

      expect(attacks1).toEqual(attacks2)
    })

    it("should generate different attacks with different seeds", () => {
      const attacks1 = generateAttacks(10, 42)
      const attacks2 = generateAttacks(10, 99)

      expect(attacks1).not.toEqual(attacks2)
    })

    it("should use default seed when not provided", () => {
      const attacks1 = generateAttacks(10)
      const attacks2 = generateAttacks(10)

      expect(attacks1).toEqual(attacks2)
    })

    it("should generate valid attack objects", () => {
      const attacks = generateAttacks(5)

      attacks.forEach((attack) => {
        expect(attack).toHaveProperty("id")
        expect(attack).toHaveProperty("timestamp")
        expect(attack).toHaveProperty("type")
        expect(attack).toHaveProperty("severity")
        expect(attack).toHaveProperty("source")
        expect(attack).toHaveProperty("target")
        expect(attack.source.countryCode).not.toBe(attack.target.countryCode)
      })
    })
  })

  describe("generateThreatStatus", () => {
    it("should generate a valid threat status object", () => {
      const status = generateThreatStatus()

      expect(status).toHaveProperty("level")
      expect(status).toHaveProperty("attacksPerMinute")
      expect(status).toHaveProperty("activeIncidents")
      expect(status).toHaveProperty("topAttackType")
    })

    it("should have valid threat level", () => {
      const status = generateThreatStatus()
      const validLevels = ["critical", "elevated", "guarded", "low"]

      expect(validLevels).toContain(status.level)
    })

    it("should have attacksPerMinute in valid range (200-999)", () => {
      const status = generateThreatStatus()

      expect(status.attacksPerMinute).toBeGreaterThanOrEqual(200)
      expect(status.attacksPerMinute).toBeLessThan(1000)
    })

    it("should have activeIncidents in valid range (10-59)", () => {
      const status = generateThreatStatus()

      expect(status.activeIncidents).toBeGreaterThanOrEqual(10)
      expect(status.activeIncidents).toBeLessThan(60)
    })

    it("should have valid attack type", () => {
      const status = generateThreatStatus()
      const validTypes = [
        "ddos",
        "brute-force",
        "sql-injection",
        "xss",
        "phishing",
        "ransomware",
        "zero-day",
        "port-scan",
        "man-in-the-middle",
      ]

      expect(validTypes).toContain(status.topAttackType)
    })

    it("should be deterministic with same seed", () => {
      const status1 = generateThreatStatus(42)
      const status2 = generateThreatStatus(42)

      expect(status1).toEqual(status2)
    })

    it("should generate different results with different seeds", () => {
      const status1 = generateThreatStatus(42)
      const status2 = generateThreatStatus(99)

      // At least one field should be different
      const isDifferent =
        status1.attacksPerMinute !== status2.attacksPerMinute ||
        status1.activeIncidents !== status2.activeIncidents

      expect(isDifferent).toBe(true)
    })
  })

  describe("generateTopTargetedCountries", () => {
    it("should generate 8 countries", () => {
      const countries = generateTopTargetedCountries()

      expect(countries).toHaveLength(8)
    })

    it("should have valid country structure", () => {
      const countries = generateTopTargetedCountries()

      countries.forEach((country: CountryAttackStat) => {
        expect(country).toHaveProperty("country")
        expect(country).toHaveProperty("countryCode")
        expect(country).toHaveProperty("attacks")
        expect(typeof country.country).toBe("string")
        expect(typeof country.countryCode).toBe("string")
        expect(typeof country.attacks).toBe("number")
      })
    })

    it("should sort countries by attacks in descending order", () => {
      const countries = generateTopTargetedCountries()

      for (let i = 0; i < countries.length - 1; i++) {
        expect(countries[i].attacks).toBeGreaterThanOrEqual(countries[i + 1].attacks)
      }
    })

    it("should have attack counts in valid range (500-5499)", () => {
      const countries = generateTopTargetedCountries()

      countries.forEach((country: CountryAttackStat) => {
        expect(country.attacks).toBeGreaterThanOrEqual(500)
        expect(country.attacks).toBeLessThan(5500)
      })
    })

    it("should be deterministic with same seed", () => {
      const countries1 = generateTopTargetedCountries(42)
      const countries2 = generateTopTargetedCountries(42)

      expect(countries1).toEqual(countries2)
    })

    it("should include expected countries", () => {
      const countries = generateTopTargetedCountries()
      const countryNames = countries.map((c: CountryAttackStat) => c.country)

      expect(countryNames).toContain("United States")
      expect(countryNames).toContain("United Kingdom")
      expect(countryNames).toContain("Germany")
      expect(countryNames).toContain("Japan")
    })

    it("should have valid country codes", () => {
      const countries = generateTopTargetedCountries()

      countries.forEach((country: CountryAttackStat) => {
        expect(country.countryCode).toMatch(/^[A-Z]{2}$/)
      })
    })
  })

  describe("generateAttackTypeBreakdown", () => {
    it("should generate all 9 attack types", () => {
      const breakdown = generateAttackTypeBreakdown()

      expect(breakdown).toHaveLength(9)
    })

    it("should have valid attack type structure", () => {
      const breakdown = generateAttackTypeBreakdown()

      breakdown.forEach((item: AttackTypeStat) => {
        expect(item).toHaveProperty("type")
        expect(item).toHaveProperty("count")
        expect(typeof item.type).toBe("string")
        expect(typeof item.count).toBe("number")
      })
    })

    it("should include all expected attack types", () => {
      const breakdown = generateAttackTypeBreakdown()
      const types = breakdown.map((item: AttackTypeStat) => item.type)
      const expectedTypes = [
        "ddos",
        "brute-force",
        "sql-injection",
        "xss",
        "phishing",
        "ransomware",
        "zero-day",
        "port-scan",
        "man-in-the-middle",
      ]

      expectedTypes.forEach((expectedType) => {
        expect(types).toContain(expectedType)
      })
    })

    it("should sort attack types by count in descending order", () => {
      const breakdown = generateAttackTypeBreakdown()

      for (let i = 0; i < breakdown.length - 1; i++) {
        expect(breakdown[i].count).toBeGreaterThanOrEqual(breakdown[i + 1].count)
      }
    })

    it("should have counts in valid range (100-3099)", () => {
      const breakdown = generateAttackTypeBreakdown()

      breakdown.forEach((item: AttackTypeStat) => {
        expect(item.count).toBeGreaterThanOrEqual(100)
        expect(item.count).toBeLessThan(3100)
      })
    })

    it("should have positive counts for all types", () => {
      const breakdown = generateAttackTypeBreakdown()

      breakdown.forEach((item: AttackTypeStat) => {
        expect(item.count).toBeGreaterThan(0)
      })
    })

    it("should be deterministic with same seed", () => {
      const breakdown1 = generateAttackTypeBreakdown(42)
      const breakdown2 = generateAttackTypeBreakdown(42)

      expect(breakdown1).toEqual(breakdown2)
    })

    it("should generate different results with different seeds", () => {
      const breakdown1 = generateAttackTypeBreakdown(42)
      const breakdown2 = generateAttackTypeBreakdown(99)

      expect(breakdown1).not.toEqual(breakdown2)
    })
  })

  describe("generateTimeline", () => {
    it("should generate exactly 24 time points", () => {
      const timeline = generateTimeline()

      expect(timeline).toHaveLength(24)
    })

    it("should have valid timeline point structure", () => {
      const timeline = generateTimeline()

      timeline.forEach((point: TimelinePoint) => {
        expect(point).toHaveProperty("time")
        expect(point).toHaveProperty("attacks")
        expect(point).toHaveProperty("blocked")
        expect(typeof point.time).toBe("string")
        expect(typeof point.attacks).toBe("number")
        expect(typeof point.blocked).toBe("number")
      })
    })

    it("should have time in HH:00 format", () => {
      const timeline = generateTimeline()

      timeline.forEach((point: TimelinePoint) => {
        expect(point.time).toMatch(/^\d{2}:00$/)
      })
    })

    it("should have sequential hours from 00:00 to 23:00", () => {
      const timeline = generateTimeline()

      for (let i = 0; i < 24; i++) {
        const expectedTime = i.toString().padStart(2, "0") + ":00"
        expect(timeline[i].time).toBe(expectedTime)
      }
    })

    it("should have attacks in valid range (100-499)", () => {
      const timeline = generateTimeline()

      timeline.forEach((point: TimelinePoint) => {
        expect(point.attacks).toBeGreaterThanOrEqual(100)
        expect(point.attacks).toBeLessThan(500)
      })
    })

    it("should have blocked attacks less than or equal to total attacks", () => {
      const timeline = generateTimeline()

      timeline.forEach((point: TimelinePoint) => {
        expect(point.blocked).toBeLessThanOrEqual(point.attacks)
      })
    })

    it("should have blocked percentage between 60% and 90%", () => {
      const timeline = generateTimeline()

      timeline.forEach((point: TimelinePoint) => {
        const percentage = point.blocked / point.attacks
        expect(percentage).toBeGreaterThanOrEqual(0.6)
        expect(percentage).toBeLessThanOrEqual(0.9)
      })
    })

    it("should be deterministic with same seed", () => {
      const timeline1 = generateTimeline(42)
      const timeline2 = generateTimeline(42)

      expect(timeline1).toEqual(timeline2)
    })

    it("should generate different results with different seeds", () => {
      const timeline1 = generateTimeline(42)
      const timeline2 = generateTimeline(99)

      expect(timeline1).not.toEqual(timeline2)
    })

    it("should have positive values for attacks and blocked", () => {
      const timeline = generateTimeline()

      timeline.forEach((point: TimelinePoint) => {
        expect(point.attacks).toBeGreaterThan(0)
        expect(point.blocked).toBeGreaterThan(0)
      })
    })
  })
})
