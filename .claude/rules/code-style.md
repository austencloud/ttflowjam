# Code Style

- **No barrel exports.** Never create `index.ts` re-export files in `src/lib/`. Import from source.
- **No `utils/`, `helpers/`, or `hooks/` folders.** Shared logic: `src/lib/services/<domain>.ts`. Validation: `src/lib/schemas/`. Component-local logic stays in the component.
- Svelte 5 runes only: `$props()` with `interface Props`, prefer `$derived` over `$effect`, shared reactive state in `.svelte.ts` factories.
- No `Service` suffix in names.
- Single responsibility per file. File count is a non-issue; monolith files are.
- Tests are earned: pure algorithms, parsing, validation, twice-regressed bugs. Not UI glue.
