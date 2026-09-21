# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js timezone converter web application that allows users to convert time between different timezones and compare overlapping time periods. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint the codebase
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Report where @vvo/tzdb's packaged data has fallen behind the runtime's IANA data
pnpm check:tzdata

# Format code (CSS, SCSS, MD, MDX, JSON)
pnpm format:fix

# Run Storybook (component development)
pnpm storybook

# Generate new component with template
pnpm new-component
```

## Architecture

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode disabled)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Date/Time**: Luxon library for timezone conversions
- **Timezone Data**: @vvo/tzdb for timezone information
- **Drag & Drop**: @dnd-kit for reordering timezones

### Project Structure

- `/src/app/` - Next.js app router pages
  - `page.tsx` - Main timezone converter interface
  - `about/page.tsx` - About page
  - `layout.tsx` - Root layout with theme provider
- `/src/components/` - React components
  - UI components from shadcn/ui in `/ui/`
  - Custom atomic components in `/atoms/` (H1, H2, P1, P2, P3)
  - Main components: TimezoneDisplay, TimezonePickerDialog, DateTimePicker
- `/src/lib/` - Utility functions
  - `timezone.ts` - Timezone manipulation utilities
  - `string.ts` - String formatting helpers
  - `utils.ts` - General utilities including `cn()` for className merging

### Time Zone Data

Two separate sources feed the UI, and only one of them is current:

- **Luxon** does not ship any time zone data. `DateTime.setZone()` delegates to
  the runtime's `Intl`, so every conversion follows whatever IANA tzdata the
  browser carries and tracks new rules as browsers update.
- **`@vvo/tzdb`** provides the zone list, city names and groupings, but its
  offsets and abbreviations are generated at release time and freeze there. It
  has published nothing since 2025-12-01, so it predates tzdata 2026a–2026d —
  the releases covering British Columbia, Alberta and the Northwest Territories
  settling on one offset year round, and Morocco moving to permanent +00.
  Upgrading it is not an option; 6.198.0 is the latest release.

`src/lib/timezone.ts` is the seam between them: offsets and abbreviations are
read from `Intl` at runtime (`getZoneOffsetInMinutes`, `getZoneLabel`), never
from tzdb's `rawOffsetInMinutes` or `abbreviation`, so a region that changes its
rules is picked up without a dependency bump. tzdb's `abbreviation` survives
only as a fallback for zones `Intl` labels "GMT-7".

Two details worth knowing before changing this file:

- `Intl` only spells out an abbreviation for zones local to the locale asked
  about — `en-US` gives "PDT" for Vancouver but "GMT+10" for Sydney. The zone's
  own country is tried first, then `en-US`.
- tzdb lists one primary zone per group and folds 344 other IANA names into
  `group`, so `findTimeZone()` falls back to the group. Every alias currently
  keeps its primary's time; `pnpm check:tzdata` reports it if one ever splits,
  which would need real code rather than the group fallback.

Run `pnpm check:tzdata` when a region changes its clocks. Anything it reports
under "standard offsets" is already handled at runtime; "group aliases" and
"zones missing" need a code change.

### Key Patterns

- Client components use `'use client'` directive
- Path aliases: `@/` maps to `./src/`
- Component structure follows atomic design with Storybook stories
- Dark mode support via next-themes
- Responsive design with Tailwind breakpoints

## Component Development

New components can be generated using Hygen templates:

```bash
pnpm new-component
```

This creates:

- Component file with TypeScript interface
- Storybook story file
- Index export file

## Testing & Quality

- ESLint configuration extends `eslint-config-eason` and Next.js rules
- Prettier for code formatting
- TypeScript for type checking (strict mode disabled)
- Storybook for component development and visual testing
