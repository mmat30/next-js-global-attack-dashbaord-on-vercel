# Global Attack Dashboard — Implementation Plan

## Context

Building a cybersecurity monitoring dashboard with a 3D globe visualization showing global attack activity. The project is early-stage — only the default Next.js 16 template exists. The goal is a fast, SSR-first dashboard with well-decomposed components, DRY principles, and all assets local (no external APIs for the globe).

---

## Tech Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Globe library | **COBE** (5kB) | Procedurally generates earth — no texture downloads needed. SSR-safe, performant, used by Vercel themselves |
| Charts | **Recharts via `npx shadcn add chart`** | Stays within the shadcn design system, respects theme variables |
| Layout | **shadcn Sidebar** | Pre-built accessible sidebar with dark mode support |
| Data | **Mock data (server-generated)** | SSR seed data passed as props; client hooks simulate live updates |
| Arcs on globe | **Markers only (V1)** | COBE doesn't support arcs natively. Green markers = source, red = target. Arcs deferred to V2 |

---

## Directory Structure

```
src/
  app/
    layout.tsx                 — Root layout: dark class, SidebarProvider, fonts
    page.tsx                   — Dashboard home: composes all widgets in CSS Grid
    loading.tsx                — Skeleton fallback for page-level Suspense
    globals.css                — Extended with cybersecurity OKLCH theme
  components/
    layout/
      app-sidebar.tsx          — Sidebar navigation (Client)
      header.tsx               — Top bar with breadcrumb + sidebar trigger (Server)
      theme-toggle.tsx         — Dark/light toggle (Client)
    globe/
      globe-visualization.tsx  — COBE canvas wrapper (Client, dynamic import ssr:false)
      globe-skeleton.tsx       — Loading placeholder (Server)
    dashboard/
      stat-card.tsx            — Reusable metric card (Server)
      attack-feed.tsx          — Live scrolling attack list (Client)
      attack-feed-item.tsx     — Single attack row (pure component)
      threat-level-indicator.tsx — Current threat level (Server)
      attack-type-breakdown.tsx  — Donut chart (Client)
      top-targeted-countries.tsx — Ranked bar list (Server)
      attack-timeline.tsx      — Area chart over time (Client)
    ui/                        — shadcn components (installed via CLI)
  lib/
    utils.ts                   — Existing cn() helper
    types.ts                   — All TypeScript interfaces
    constants.ts               — Severity colors, nav items, attack labels
    mock-data.ts               — Mock generators + static datasets
    globe-config.ts            — COBE configuration defaults
  hooks/
    use-attacks.ts             — Simulates live attack feed (Client)
    use-globe.ts               — COBE lifecycle management (Client)
```

---

## Server/Client Boundary

| Component | Boundary | Why |
|-----------|----------|-----|
| RootLayout, Header, StatCard, ThreatLevelIndicator, TopTargetedCountries, GlobeSkeleton | **Server** | Pure data display, no browser APIs |
| AppSidebar | **Client** | Uses `useSidebar` hook |
| ThemeToggle | **Client** | Manipulates `document.documentElement.classList` |
| GlobeVisualization | **Client** | WebGL canvas, animation loop |
| AttackFeed | **Client** | `setInterval` for live simulation |
| AttackTypeBreakdown, AttackTimeline | **Client** | Recharts rendering |

---

## Core Types (`src/lib/types.ts`)

```typescript
export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info"
export type AttackType = "ddos" | "brute-force" | "sql-injection" | "xss" | "phishing" | "ransomware" | "zero-day" | "port-scan" | "man-in-the-middle"
export type ThreatLevel = "critical" | "elevated" | "guarded" | "low"

export interface GeoLocation {
  lat: number; lng: number; city?: string; country: string; countryCode: string
}

export interface Attack {
  id: string; timestamp: Date; type: AttackType; severity: SeverityLevel
  source: GeoLocation; target: GeoLocation; protocol?: string; port?: number
}

export interface ThreatStatus {
  level: ThreatLevel; attacksPerMinute: number; activeIncidents: number; topAttackType: AttackType
}
```

---

## Dashboard Grid Layout

```
Desktop (lg+):
┌──────────┬──────────┬──────────┬──────────┐
│ StatCard │ StatCard │ StatCard │ StatCard │  ← Row 1: 4-col stats
├────────────────────┬─────────────────────┤
│   Globe (2 cols)   │  AttackFeed (2 cols)│  ← Row 2: main content
├────────────────────┼──────────┬──────────┤
│ Timeline (2 cols)  │Breakdown │Countries │  ← Row 3: charts + data
└────────────────────┴──────────┴──────────┘

Mobile: single column, stacked vertically.
```

---

## Performance Strategy

- **Dynamic import** for globe: `next/dynamic` with `ssr: false` + skeleton fallback
- **Suspense boundaries** around each chart component
- **Server Components** for all static widgets (no client JS shipped)
- **COBE** generates earth procedurally — no texture files to download
- **`loading.tsx`** provides instant skeleton on navigation
- **Recharts** only loaded in client chart components behind Suspense

---

## Cybersecurity Theme (globals.css overrides)

Dark mode OKLCH overrides for cyber-green aesthetic:
- Background: very dark with slight green tint
- Primary: cyber green (`oklch(0.7 0.15 160)`)
- Chart colors: green, cyan, red, amber, purple
- Borders: subtle green glow
- Severity badges: red (critical) → orange → yellow → cyan → slate (info)

---

## Implementation Phases

### Phase 1: Foundation (Layout Shell)
1. Install shadcn components: `sidebar`, `card`, `button`, `skeleton`, `badge`, `separator`, `tooltip`, `breadcrumb`, `scroll-area`
2. Create `src/lib/types.ts` and `src/lib/constants.ts`
3. Create `theme-toggle.tsx`, `app-sidebar.tsx`, `header.tsx`
4. Modify `layout.tsx` — add dark class, SidebarProvider, AppSidebar
5. Update `globals.css` with cybersecurity theme
6. Replace `page.tsx` with empty dashboard grid shell
7. Create `loading.tsx` skeleton

### Phase 2: Data Layer + Static Widgets
1. Create `src/lib/mock-data.ts` with generators
2. Build `stat-card.tsx`, `threat-level-indicator.tsx`, `top-targeted-countries.tsx`
3. Wire into `page.tsx` with mock data

### Phase 3: Globe
1. `npm install cobe`
2. Create `globe-config.ts`, `use-globe.ts` hook
3. Build `globe-skeleton.tsx` and `globe-visualization.tsx`
4. Add to `page.tsx` via dynamic import

### Phase 4: Charts + Live Feed
1. `npx shadcn add chart`
2. Build `attack-type-breakdown.tsx` and `attack-timeline.tsx`
3. Create `use-attacks.ts` hook, `attack-feed-item.tsx`, `attack-feed.tsx`
4. Wire all into `page.tsx` with Suspense boundaries

### Phase 5: Polish
1. Responsive grid breakpoints (mobile/tablet/desktop)
2. Animations: pulse on new attacks, fade-in feed items
3. `npm run build` — verify bundle size, no SSR errors
4. Verify Vercel deployment

---

## Verification

1. `npm run build` — must succeed with no SSR errors
2. `npm run dev` — dashboard loads at localhost:3000 with dark theme, sidebar, spinning globe
3. Globe renders without external API calls (check Network tab — no texture fetches)
4. StatCards and TopTargetedCountries render server-side (visible in page source)
5. AttackFeed auto-updates with new entries every 2-3 seconds
6. Charts render with themed colors matching the cybersecurity palette
7. Responsive: test at 375px, 768px, 1440px widths
8. `npm run lint` passes
