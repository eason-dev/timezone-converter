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