# Alstom RCIS

Alstom RCIS is an internal **Power Module ESD Line Rework Intelligence System** built as a modular Next.js platform for manufacturing analytics, corrective action tracking, and root-cause intelligence.

## Implemented Modules (Phase 1 + Phase 2 Foundation)

- Rework Entry Module with structured capture fields and Admin-gated writes
- Dashboard with weekly KPI cards, trend chart, Pareto-style defects, shift/severity analysis
- Pattern Detection Engine APIs and automated textual insights
- Corrective Action Tracker with status-focused monitoring
- Risk Heat Map (station vs severity matrix)
- Recurrence Alert logic (>3 recurrences in 7 days)
- Knowledge Bank with searchable station/defect filters
- Export endpoints for Excel (`/api/export/excel`) and PDF (`/api/export/pdf`)
- Role-based access model (`Admin` / `Viewer`) for create operations

## Tech Stack

- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js Route Handlers (Node runtime)
- Database: Prisma ORM with structured schema (ready for PostgreSQL migration)
- Charts: Chart.js (`react-chartjs-2`)
- Reporting: XLSX + pdf-lib

## Run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

> If your environment blocks npm registry access, dependency install/build cannot complete until network/package policy is lifted.
