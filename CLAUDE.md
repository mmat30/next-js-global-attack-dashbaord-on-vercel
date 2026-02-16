# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Global Attack Dashboard — a Next.js 16 cybersecurity monitoring dashboard deployed on Vercel. Early-stage project built on React 19 with TypeScript strict mode.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm test` — Run tests (called by pre-commit hook)
- `npx shadcn add <component>` — Add a shadcn/ui component

## Git Conventions

Commits are enforced by Husky hooks:
- **pre-commit**: runs `npm test`
- **commit-msg**: validates conventional commit format via commitlint

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): message`
(e.g., `feat(dashboard): add attack map component`)

Branches: `dev` for development, `master` for production.

## Architecture

- **Framework**: Next.js 16 App Router with React Server Components enabled by default
- **Styling**: Tailwind CSS 4 with CSS variables (OKLCH color space), dark mode via `.dark` class
- **Components**: shadcn/ui (new-york style) built on Radix UI primitives, icons from lucide-react
- **Utilities**: `cn()` helper in `src/lib/utils.ts` merges Tailwind classes via clsx + tailwind-merge

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json). Shadcn/ui aliases:
- `@/components` — App components
- `@/components/ui` — shadcn/ui components
- `@/lib` — Utilities
- `@/hooks` — Custom hooks

## Theming

Global theme variables are defined in `src/app/globals.css` with light/dark variants. Five chart colors are pre-configured for data visualization. Sidebar-specific color variables are available for navigation layout.
