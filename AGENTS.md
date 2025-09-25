# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Laravel application logic (controllers under `app/Http`, broadcasts in `app/Events`).
- `resources/js` contains the Vue + Inertia front end organized by feature folders (`Game`, `Realtime`, `Stores`) with shared layouts in `resources/js/layouts`.
- Blade entry points and emails live in `resources/views`; static assets are served from `public/`.
- Tests sit in `tests/Feature` and `tests/Unit`, bootstrapped by Pest via `tests/TestCase.php`.
- Long-form notes and diagrams belong in `docs/`, while data scaffolding resides in `database/` (migrations, seeders, factories).

## Build, Test, and Development Commands
- `composer install && npm install` prepares PHP and Node dependencies.
- `composer run dev` launches the full-stack loop (Laravel serve, queue listener, logs, Vite) in one terminal; use when iterating on realtime features.
- `npm run dev` starts Vite HMR if the backend already runs elsewhere.
- `npm run build` (or `npm run build:ssr`) produces production bundles; pair with `php artisan config:cache` before deploying.
- `composer test` or `php artisan test` executes the Pest suite; append `--coverage` when Xdebug is available for metrics.

## Coding Style & Naming Conventions
- Run `./vendor/bin/pint` to enforce PSR-12 on PHP files; use 4-space indentation and singular class names (`GameController`).
- Vue/TypeScript files rely on Prettier (`npm run format`) and ESLint (`npm run lint`); keep components PascalCase in `resources/js/components` and Pinia stores camelCase in `resources/js/Stores`.
- Route names should stay kebab-cased and match Ziggy expectations (`game.play`, `rooms.index`), mirroring entries in `routes/web.php` and `routes/api.php`.

## Testing Guidelines
- Place HTTP/integration scenarios in `tests/Feature/*Test.php` and pure logic specs in `tests/Unit/*Test.php`; describe behaviour in method names (`it_can_join_ranked_queue`).
- Use factories in `database/factories` to create deterministic models; seed data inside test cases rather than relying on shared state.
- Run `php artisan test` before opening a PR; `php artisan test --parallel` speeds up larger suites.

## Commit & Pull Request Guidelines
- Follow the `<type>: <imperative summary>` format when practical (`feat: add ranked queue lobby`), consistent with recent history (`chore: add sqlite database...`).
- Keep commits focused and include schema, asset, or config updates alongside code that depends on them.
- Pull requests need a concise summary, linked issue reference, and test evidence. Add screenshots or GIFs for UI changes and note any `.env` or migration impacts for reviewers.
