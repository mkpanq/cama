# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages and layouts. Rather avoid to put there any logic, of course besides server actions (action.ts files). Keep all pages, layouts and components there.
- `src/lib`: Domain modules (`*.service.ts`, `*.type.ts`, `*.repository.ts`). All logic implementation which is used across all the server actions, API routes etc.
- `src/db`: Drizzle client and `schema/` definitions.
- `src/jobs`: BullMQ workers/queues and config.
- `drizzle/`: Generated SQL/migration artifacts.
- `public/`, `docker/`, `.env(.example)`: assets, Dockerfiles, and configuration.

## Build, Test, and Development Commands
- `pnpm i`: Install dependencies.
- `pnpm dev`: Run Next.js locally (Turbopack).
- `pnpm build`: Production build.
- `pnpm start`: Serve production build.
- `pnpm lint`: Run Next lint.
- `pnpm run generate | migrate | drop`: Drizzle schema ops.
- `pnpm run todos`: Update `TODO.md` (pre-commit hook runs this).
- Tip: Install hooks with `pnpm dlx lefthook install`.

## Coding Style & Naming Conventions
- TypeScript, 2-space indentation, double quotes (Biome enforced).
- Keep modules small; colocate types/services under `src/lib/<domain>/`.
- Components and files: `lowerCamelCase` for functions, `PascalCase` for React components, `kebab-case` for route folders.
- Run `npx @biomejs/biome check --write .` to format locally.

<!-- ## Testing Guidelines
- Currently no test suite is configured. When adding tests:
  - Place unit tests near code using `__tests__/` and `*.test.ts`.
  - Prefer Vitest/Jest for unit; Playwright for e2e.
  - Add `pnpm test` script and ensure CI runs `lint`, `build`, and tests. -->

## Commit & Pull Request Guidelines
- Commits: short, imperative subject; scope in body if needed (no strict Conventional Commits).
- PRs: clear description, purpose, and UI screenshots for visual changes.
- Link related issues/TODOs. Ensure `pnpm lint` and `pnpm build` pass.
- If DB schema changes: include generated files under `drizzle/` and update `.env.example` as needed.

## Security & Configuration Tips
- Required env vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `REDIS_URL`, `JWT_SECRET`, `DASHBOARD_USER`, `DASHBOARD_PASSWORD`, `GOCARDLESS_API_URL`, `GOCARDLESS_SECRET_ID`, `GOCARDLESS_SECRET_KEY`, `APPLICATION_MAIN_URL`.
- Use only variables from `.env.example` even if there's no values. If you think there's a need for new env variable add proper key to `.env.example`. Do not try to fill any env values and the envs in other files should not be edited.
- Redis is required for jobs; Postgres is required for Drizzle. Dockerfiles are provided under `docker/`.
