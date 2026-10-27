# TaskTraceAutomator — Task Tracker

**Plan:** [plan.md](plan.md) · **Status values:** `TODO` · `IN_PROGRESS` · `BLOCKED` · `COMPLETE`

**How to update:** every task starts as `TODO`. Set `COMPLETE` only when done. Leave `IN_PROGRESS` or `BLOCKED` as is until the state changes. Add a dated comment (`YYYY-MM-DD: ...`) on every status change. A parent is `COMPLETE` only when all its subtasks are.

**Summary:** 0 of 0 phases complete — update this line as phases close.

---

## Phase 0 — Foundation

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T0.1 | Repository scaffold and layout | §13 | — | TODO | Create the layout from §13, linting, formatting, pre-commit, CI skeleton. |
| T0.1.a | Initialize repo structure and Python tooling | §13 | — | TODO | Ruff, mypy, pytest config. |
| T0.1.b | Docker Compose stack (Django, Postgres, Redis, Celery worker and beat) | §3 | T0.1.a | TODO | Single command local start. |
| T0.1.c | CI workflow for lint, type check, tests (backend and frontend) | §11 | T0.1.a | TODO | GitHub Actions free tier. Frontend adds ESLint, `tsc`, Vitest, OpenAPI drift check. |
| T0.2 | Django apps and settings | §4 | T0.1 | TODO | One app per bounded context; enforce layering rules from §4. |
| T0.2.a | Frontend scaffold (React, TypeScript, Vite, Tailwind, React Router, TanStack Query) | §9.2, §13 | T0.1.a | TODO | Lives in `frontend/`. ESLint and Vitest configured. |
| T0.2.b | OpenAPI schema export and generated TypeScript client | §9.1 | T0.2, T0.2.a | TODO | `drf-spectacular` schema to `openapi-typescript`; CI drift check. |
| T0.2.c | `frontend` container (Node build, nginx) and Compose wiring with `/api` proxy | §3 | T0.1.b, T0.2.a | TODO | Same-origin setup; Vite dev proxy for local development. |
| T0.2.d | SPA auth shell: session login, CSRF handling, role-aware routes | §9.1, §10 | T0.6, T0.2.a | TODO | |
| T0.3 | Core data models and migrations | §8.2 | T0.2 | TODO | Project, Meeting, TranscriptSegment, artifacts, runs, approvals. |
| T0.3.a | Project model including `create_pull_request` setting | §8.2 | T0.2 | TODO | Setting controls the good-to-have PR (G1). Decided: default is **off** in the MVP. |
| T0.3.b | Meeting, TranscriptSegment, RequirementPackage models | §8.2 | T0.2 | TODO | Segment checksums, versioned artifacts. |
| T0.3.c | WorkItem, ImplementationPlan, PlanChange, CodingRun models | §8.2 | T0.2 | TODO | Unique constraint on active run per `work_item + plan_version`. |
| T0.3.d | ExternalIssue, WebhookEvent, ActivityLog models | §8.2, §8.3 | T0.2 | TODO | Idempotency keys and external references. |
| T0.4 | State machine and transition rules | §7 | T0.3 | TODO | Illegal transitions rejected; transitions idempotent. |
| T0.5 | Audit service | §5.10 | T0.3 | TODO | Append-only audit events for every state change. |
| T0.6 | Authentication and roles | §10 | T0.2 | TODO | Reviewer and admin roles; approval authority checks. |
| T0.7 | Foundation tests | §11 | T0.4, T0.5 | TODO | Exit check: transitions tested and idempotent. |

## Phase 1 — Understand

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T1.1 | Transcript ingestion | §5.1 | P0 | TODO | Text, `.md`, `.vtt`, `.srt` first. |
| T1.1.a | File and paste upload with size cap and extension allow-list | §5.1 | P0 | TODO | |
| T1.1.b | Parsers into `TranscriptSegment` with SHA-256 checksum | §5.1 | T1.1.a | TODO | |
| T1.1.c | Regex secret and PII redactor | §5.1, §10 | T1.1.b | TODO | Run before the transcript reaches any LLM. |
| T1.2 | Audio transcription | §5.1 | T1.1 | TODO | Moved to good-to-have G2. ID kept so references stay valid; see Good-to-Have section. |
| T1.3 | Meeting Analyst | §5.2 | T1.1 | TODO | |
| T1.3.a | Pydantic schema for `RequirementPackage` | §5.2 | P0 | TODO | Items carry `source_segment_ids` and confidence. |
| T1.3.b | LLM call with delimited untrusted transcript | §5.2, §10 | T1.3.a | TODO | No tools, no side effects. |
| T1.3.c | Validation with one repair retry, then fail | §5.2 | T1.3.b | TODO | |
| T1.3.d | Chunk-and-merge for long transcripts | §5.2 | T1.3.c | TODO | |
| T1.4 | Requirement review UI (React) | §9.2 | T1.3, T0.2.d | TODO | Built on the generated API client. |
| T1.4.a | Transcript view with highlighted source spans, linked to requirement items | §9.2 | T1.3.a | TODO | |
| T1.4.b | Edit, split, delete, add items; resolve open questions (React Hook Form + Zod) | §9.2 | T1.4.a | TODO | |
| T1.4.c | Component tests (Vitest, MSW) | §11 | T1.4.b | TODO | |
| T1.5 | Requirement approval gate | §5.9 | T1.4 | TODO | Approval creates an immutable artifact version and an audit event. |
| T1.6 | Phase 1 tests and exit check | §11 | T1.5 | TODO | Exit check: a draft package is corrected and approved. |

## Phase 2 — Plan

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T2.1 | Repository profile | §5.3 | P0 | TODO | Clone target repo, detect language, test and lint commands. |
| T2.2 | Context Builder (deterministic) | §5.4 | T2.1 | TODO | No embeddings in the MVP. |
| T2.2.a | File discovery with `git ls-files` and ripgrep | §5.4 | T2.1 | TODO | |
| T2.2.b | Symbol extraction with `ast` / ctags | §5.4 | T2.2.a | TODO | |
| T2.2.c | Django route and model discovery | §5.4 | T2.2.a | TODO | |
| T2.2.d | Recent-change heat from `git log` | §5.4 | T2.2.a | TODO | |
| T2.2.e | Assemble `ContextPackage` with reasons per file | §5.4 | T2.2.b, T2.2.c, T2.2.d | TODO | Reviewer must see why each file is in scope. |
| T2.3 | Planner | §5.3 | T1.5, T2.2 | TODO | |
| T2.3.a | Generate `WorkItem` with Given/When/Then criteria and test plan | §5.3 | T1.5 | TODO | |
| T2.3.b | Generate `ImplementationPlan` with allowed and protected paths, commands, diff budget | §5.3 | T2.3.a, T2.2.e | TODO | |
| T2.4 | Plan review UI (React) with allow-list editing | §9.2 | T2.3, T0.2.d | TODO | Includes plan diff view for `PlanChange`. |
| T2.5 | Plan versioning and approval gate | §5.9 | T2.4 | TODO | |
| T2.6 | `PlanChange` flow | §5.3 | T2.5 | TODO | Diff against the approved plan, reason, and approval; only approved changes become sub-issues later. |
| T2.7 | Phase 2 tests and exit check | §11 | T2.5 | TODO | Exit check: reviewer sees why each file is in scope. |

## Phase 3 — Tracker

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T3.1 | GitHub tracker adapter foundation | §5.5 | P2 | TODO | |
| T3.1.a | Auth, GraphQL client, cached Status field and option IDs | §5.5 | P2 | TODO | |
| T3.1.b | Project setup and `create_pull_request` setting wired to config | §5.5 | T3.1.a | TODO | Default off (decided in T0.3.a). The setting only gates G1. |
| T3.2 | Backlog issue creation | §5.5 | T3.1 | TODO | |
| T3.2.a | Create issue and project item with idempotency marker | §5.5 | T3.1.a | TODO | Key = `work_item_id + plan_version`. |
| T3.2.b | Store `ExternalIssue` references | §5.5 | T3.2.a | TODO | |
| T3.3 | Sub-issue creation from approved `PlanChange` | §5.5 | T3.2, T2.6 | TODO | |
| T3.4 | TaskTrace board UI and UI commands | §9.2 | T3.2, T0.2.d | TODO | Move, comment, assign, block/unblock; each writes an audit event. |
| T3.4.a | Board with columns and cards (React) | §9.2 | T3.2 | TODO | |
| T3.4.b | Drag and drop with dnd-kit; card reverts if the backend rejects the move | §9.2, §7 | T3.4.a, T3.6 | TODO | Backend remains the only authority on transitions. |
| T3.4.c | Comment, assign, block/unblock dialogs and audit timeline view | §9.2 | T3.4.a | TODO | |
| T3.4.d | Component tests and board drag-and-drop test | §11 | T3.4.b | TODO | |
| T3.5 | Webhooks and reconciliation | §5.5 | T3.2 | TODO | |
| T3.5.a | Receiver with `X-Hub-Signature-256` verification | §5.5, §10 | T3.2 | TODO | |
| T3.5.b | Persist `WebhookEvent`, dedupe by `X-GitHub-Delivery` | §5.5 | T3.5.a | TODO | |
| T3.5.c | GraphQL polling fallback when org webhook unavailable | §5.5, §15 | T3.5.b | TODO | |
| T3.5.d | Beat reconciliation of board and internal state | §5.5 | T3.5.b | TODO | |
| T3.6 | Illegal move detection and card revert | §5.5, §7 | T3.5.b, T0.4 | TODO | Revert with an explanatory comment. |
| T3.7 | Run trigger on move to TODO | §5.6 | T3.5.b, T3.6 | TODO | Validate project, approved plan link, no active run; create queued `CodingRun`. |
| T3.8 | Phase 3 tests and exit check | §11 | T3.7 | TODO | Exit check: moving a card to TODO creates a queued run exactly once. |

## Phase 4 — Build and Verify

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T4.1 | Runner image | §6 | P3 | TODO | |
| T4.1.a | Dockerfile with non-root user, read-only root, writable `/workspace` | §6 | P3 | TODO | |
| T4.1.b | Resource limits, `--cap-drop ALL`, no Docker socket | §6 | T4.1.a | TODO | |
| T4.1.c | Egress allow-list proxy (Anthropic API, GitHub, registries) | §6 | T4.1.a | TODO | |
| T4.2 | Runner lifecycle in Celery worker | §6 | T4.1 | TODO | Create container, clone at pinned commit, create branch `tta/issue-<n>`, collect `result.json`, remove container. |
| T4.3 | Prompt builder | §5.7 | T2.3 | TODO | Instructions kept separate from untrusted content. |
| T4.4 | Claude Code adapter (`claude -p`) | §5.7 | T4.2, T4.3 | TODO | Turn, time, and cost budgets. Agent pauses and requests approval rather than widening scope. |
| T4.5 | Verifier | §5.8 | T4.2 | TODO | |
| T4.5.a | Run tests, lint, type checks | §5.8 | T4.2 | TODO | |
| T4.5.b | Security and secret scans | §5.8 | T4.2 | TODO | |
| T4.5.c | Scope enforcement against allowed and protected paths and diff budget | §5.8, §10 | T4.2 | TODO | Failure blocks the push/PR and the move to In Review. |
| T4.5.d | Acceptance-criteria traceability mapping | §5.8 | T4.5.a | TODO | |
| T4.5.e | Verification report generation | §5.8 | T4.5.a, T4.5.b, T4.5.c, T4.5.d | TODO | Includes cost, duration, assumptions, diff summary. |
| T4.6 | Branch push and branch handoff | §6, §5.6 | T4.5 | TODO | MVP handoff path. PR creation is good-to-have G1. |
| T4.6.a | Push branch with scoped fine-grained token | §6 | T4.5.e | TODO | Contents write only. PR write is added only if G1 is enabled. |
| T4.6.b | Branch handoff: branch link and diff on the ticket | §5.5 | T4.6.a | TODO | The user sets Done manually in this mode. |
| T4.7 | Ticket update to In Review with evidence | §5.5 | T4.6 | TODO | Comment with the report and branch link (plus PR link if G1 is on). |
| T4.8 | Run detail UI (React) | §9.2 | T4.5, T0.2.d | TODO | Live status via TanStack Query polling (3 s), logs, diff, report, branch link; PR link if G1 is on. |
| T4.9 | Phase 4 tests and exit check | §11 | T4.7 | TODO | Exit check: an out-of-scope edit is blocked; a good run pushes a branch and updates the ticket. |

## Phase 5 — Hardening

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T5.1 | Crash recovery | §5.6, §15 | P4 | TODO | `acks_late`, reject on worker lost, beat job re-enqueues stuck runs. |
| T5.2 | Retry cap and failure escalation | §5.6 | P4 | TODO | Escalate to Blocked with a reason. |
| T5.3 | Duplicate and delayed webhook tests | §11 | P4 | TODO | |
| T5.4 | Worker-restart-mid-run test | §11 | T5.1 | TODO | Exit check: no duplicate issues, runs, or PRs. |
| T5.5 | Security review | §10 | P4 | TODO | Prompt-injection cases, token scopes, sandbox escape checks. |
| T5.7 | Frontend end-to-end test of the core path (Playwright) | §11 | P4 | TODO | Upload, approve, move card to TODO, view report. Optional if time is short. |
| T5.6 | Observability baseline | §11 | P4 | TODO | Structured logs and basic metrics. Prometheus/Grafana are good-to-have G4. |

## Phase 6 — Evaluation

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T6.1 | Build fixed evaluation set | Plan §evaluation | P5 | TODO | Transcripts with expected requirements and small target repo changes. |
| T6.2 | Run staged agent over the set | Plan §evaluation | T6.1 | TODO | Record pass rate, scope violations, cost, duration. |
| T6.3 | Manual baseline for comparison | Plan §evaluation | T6.1 | TODO | |
| T6.4 | Evaluation report | Plan §evaluation | T6.2, T6.3 | TODO | Decides whether specialist agents are justified (G8). |

---

## Good-to-Have Options

These are not needed for the MVP exit checks. Build them only after the core path works or when a clear need appears. Each has an ID in the `G<n>` series, an enabling condition, and the same status values and rules as above. Core tasks must not depend on them.

| ID | Option | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| G1 | GitHub pull request creation | §5.6, §6 | T4.6 | TODO | Per-project `create_pull_request` setting, default off. |
| G1.a | Add pull-request write to the scoped token | §6 | T4.6.a | TODO | Only when the setting is on. |
| G1.b | Open PR with `Closes #n`, idempotent via `ActivityLog` | §5.6, §8.3 | G1.a | TODO | Retry must never create a duplicate PR. |
| G1.c | Link PR on ticket and run detail UI | §5.5, §9.2 | G1.b | TODO | |
| G1.d | Merge webhook moves ticket to Done | §5.5, §7 | G1.b, T3.5.b | TODO | Without G1, the user sets Done manually. |
| G1.e | Tests: PR created once, none when setting is off | §11 | G1.b | TODO | |
| G2 | Audio transcription (faster-whisper, CPU) | §5.1 | T1.1 | TODO | Replaces T1.2. Transcript upload remains the primary path. |
| G3 | MinIO object storage | §8.1 | T0.3 | TODO | Default is the local `artifacts/` volume. |
| G4 | Prometheus and Grafana dashboards | §11 | T5.6 | TODO | |
| G5 | Free fallback coding agent (Aider, OpenHands, or local Ollama) | §12 | T4.4 | TODO | Same adapter contract: prompt file and workspace in, diff and `result.json` out. Lower quality expected. |
| G6 | Semantic retrieval with pgvector | §5.4 | T2.2 | TODO | Add only if deterministic retrieval misses relevant files in P6. |
| G7 | Alternative tracker adapters (Jira, Linear, Plane) | §4, §5.5 | T3.1 | TODO | The tracker adapter is already behind a `Protocol`. |
| G8 | Specialist agents | Plan | T6.4 | TODO | Only if the evaluation shows a measured quality, safety, cost, or throughput gain. |
| G9 | Hosted deployment on a free VM | §3, §12 | P5 | TODO | For example Oracle Cloud Always Free. |
| G10 | Server-sent events for live run and board updates | §9.2 | T4.8 | TODO | Replaces polling. Needs an ASGI endpoint. |
