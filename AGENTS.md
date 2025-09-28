# Repository Guidelines

## Project Structure & Module Organization
- `lightrag/`: core Python package (RAG logic). Subpackages: `api/` (FastAPI server, gunicorn), `kg/` (storage backends), `llm/` (LLM bindings), `tools/`.
- `examples/`: runnable scripts demonstrating common workflows.
- `lightrag_webui/`: React + Vite + TypeScript Web UI.
- `docs/`, `assets/`: documentation and static assets.
- Config samples: `env.example`, `config.ini.example`, `lightrag.service.example`.

## Build, Test, and Development Commands
- Install (editable): `pip install -e .` or with API extras: `pip install -e ".[api]"`.
- Run API (dev): `lightrag-server` (env keys from `.env` or shell). Gunicorn: `lightrag-gunicorn --workers 4`.
- Web UI (with Bun): `cd lightrag_webui && bun run dev` | build: `bun run build` | preview: `bun run preview`. No Bun: use `*-no-bun` scripts.
- Lint/format (CI mirrors this): `pre-commit run --all-files` (ruff + format).
- Try examples: `python examples/lightrag_openai_demo.py` (adjust env per README and `env.example`).

## Coding Style & Naming Conventions
- Python: 4‑space indent, type hints preferred. Modules/functions `snake_case`, classes `PascalCase`, constants `UPPER_SNAKE_CASE`.
- Linting/formatting: Ruff manages both (`ruff` and `ruff-format` via pre‑commit). Fixes auto‑applied where safe.
- Frontend: TypeScript + ESLint + Prettier. Run `bun run lint` locally.

## Testing Guidelines
- No dedicated `tests/` folder yet. Validate changes by running example scripts and API endpoints.
- If adding tests, prefer `pytest` under `tests/` mirroring package paths. Name tests `test_*.py` and keep them hermetic.

## Commit & Pull Request Guidelines
- Commits: concise, imperative subject; scope optional (e.g., `api: improve startup flags`). Group logical changes.
- PRs: use `.github/pull_request_template.md`. Include description, related issues, steps to validate, and screenshots/logs when UI/API behavior changes.
- All PRs must pass pre‑commit CI; run locally before pushing.

## Security & Configuration Tips
- Configure keys via `.env` (see `env.example`): e.g., `LLM_BINDING_API_KEY`, `EMBEDDING_BINDING_API_KEY`. Do not commit secrets.
- Choose bindings via CLI flags (`--llm-binding`, `--embedding-binding`) or env. See `lightrag/api/README.md` for production gunicorn options.
