# TaskTraceAutomator — Task Tracker

**Plan:** [plan.md](plan.md) · **Status values:** `TODO` · `IN_PROGRESS` · `BLOCKED` · `COMPLETE`

**How to update:** every task starts as `TODO`. Set `COMPLETE` only when done. Leave `IN_PROGRESS` or `BLOCKED` as is until the state changes. Add a dated comment (`YYYY-MM-DD: ...`) on every status change. A parent is `COMPLETE` only when all its subtasks are.

**Roles:** Admin (Full access), Member (Approver access), Non-member (Viewer access). Viewer and Approver are access levels, not roles. See Architecture §9.3.

**Summary:** 0 of 7 phases complete (Phase 0 in progress) — update this line as phases close.

---

## Phase 0 — Foundation

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T0.1 | Repository scaffold and layout | §13 | — | COMPLETE | 2026-10-28: Scaffolding, layout, python tooling, compose stack, and CI workflow initialized. |
| T0.1.a | Initialize repo structure and Python tooling | §13 | — | COMPLETE | 2026-10-28: Repository layout with all backend code in api/ and frontend in app/. pyproject.toml, requirements, ruff, mypy, and pytest config created. |
| T0.1.b | Docker Compose stack (Django, Postgres, Redis, Celery worker and beat) | §3 | T0.1.a | COMPLETE | 2026-10-28: Dockerfile in api/, app/ and docker-compose.yml for Django, Postgres 16, Redis 7, Celery worker, beat, and app created. |
| T0.1.c | CI workflow for lint, type check, tests (backend and frontend) | §11 | T0.1.a | COMPLETE | 2026-10-28: GitHub Actions CI workflow (.github/workflows/ci.yml) configured for api/ and app/. |
| T0.2 | Django apps and settings | §4 | T0.1 | IN_PROGRESS | 2026-10-28: Domain app packages and base config/settings.py created inside api/. |
| T0.2.a | Frontend scaffold (React, TypeScript, Vite, Tailwind, React Router, TanStack Query) | §9.2, §13 | T0.1.a | COMPLETE | 2026-10-28: React 18, TypeScript, Vite, Tailwind, React Router, TanStack Query, Vitest scaffolded in app/. |
| T0.2.b | OpenAPI schema export and generated TypeScript client | §9.1 | T0.2, T0.2.a | TODO | `drf-spectacular` schema to `openapi-typescript`; CI drift check. |
| T0.2.c | `frontend` container (Node build, nginx) and Compose wiring with `/api` proxy | §3 | T0.1.b, T0.2.a | COMPLETE | 2026-10-28: Multi-stage Dockerfile and nginx.conf in app/ with /api reverse proxy created and wired in docker-compose.yml. |
| T0.2.d | SPA auth shell: bearer-token login, token handling, role-aware routes | §9.1, §9.2, §9.3 | T0.6, T0.2.a | TODO | Replaces the earlier session/CSRF design. |
| T0.2.d.1 | `/login` page (username or email, password, error and "session expired" states) | §9.2 | T0.2.a | TODO | Public route. |
| T0.2.d.2 | API client with `Authorization: Bearer`, tokens in memory only, one silent refresh on 401, redirect to `/login` on failure | §9.1 | T0.2.b, T0.6.a | TODO | |
| T0.2.d.3 | Route guards by role and access level; 401/403/404/error pages | §9.2, §9.3 | T0.2.d.2, T0.6.c | TODO | Guards hide UI only; the API enforces. |
| T0.2.d.4 | App shell: sidebar, project switcher, user menu, sign out | §9.2 | T0.2.d.2 | TODO | |
| T0.3 | Core data models and migrations | §8.2 | T0.2 | TODO | Project, Meeting, TranscriptSegment, artifacts, runs, approvals. |
| T0.3.a | Project model including repo folder path, `accept_jira_side_moves` (default off), and `create_pull_request` (G1 only, default off) settings | §8.2 | T0.2 | TODO | Jira and Claude credentials are added in T3.1.b and T3.1.c. |
| T0.3.b | Meeting, TranscriptSegment, RequirementPackage models | §8.2 | T0.2 | TODO | Segment checksums, versioned artifacts. |
| T0.3.c | WorkItem, ImplementationPlan, PlanChange, CodingRun models | §8.2 | T0.2 | TODO | Unique constraint on active run per `work_item + plan_version`. |
| T0.3.d | ExternalIssue, WebhookEvent, ActivityLog models | §8.2, §8.3 | T0.2 | TODO | Idempotency keys and external references. |
| T0.4 | State machine and transition rules | §7 | T0.3 | TODO | Illegal transitions rejected; transitions idempotent. |
| T0.5 | Audit service | §5.10 | T0.3 | TODO | Append-only audit events for every state change. |
| T0.6 | Authentication, roles, and access levels | §9.1, §9.3, §10 | T0.2 | TODO | Roles: Admin, Member, Non-member. Access levels: Full, Approver, Viewer. |
| T0.6.a | JWT bearer auth endpoints: login, refresh, logout (blacklist), `me`, change-password | §9.1 | T0.2 | TODO | `djangorestframework-simplejwt`; access 15 min, refresh 7 days. |
| T0.6.b | Login rate limit, lockout, and audit events for login, logout, failures | §10 | T0.6.a, T0.5 | TODO | |
| T0.6.c | Project membership model and role-to-access-level permission class | §9.3 | T0.3 | TODO | Non-member = Viewer, Member = Approver, Admin = Full. |
| T0.6.d | Role-matrix tests: every action in §9.3 for each role | §9.3, §11 | T0.6.c | TODO | Table-driven. |
| T0.6.e | Decide author-as-sole-approver policy | §9.3 | T0.6.c | TODO | Open question; record outcome in the comment. |
| T0.7 | Foundation tests | §11 | T0.4, T0.5 | TODO | Exit check: transitions tested and idempotent. |
| T0.8 | Projects list and project settings pages (`/projects`, `/projects/:id/settings`) | §9.2 | T0.2.d, T0.3.a | TODO | Settings are Admin only: members, repo folder, path policy, test commands. The Jira and Claude connection sections are added in T3.1.b and T3.1.c. |
| T0.9 | Admin users page (`/admin/users`) | §9.2, §9.3 | T0.2.d, T0.6.c | TODO | Admin only: users, roles, project membership. |
| T0.10 | Dashboard and Profile pages (`/`, `/profile`) | §9.2 | T0.2.d | TODO | Dashboard widgets fill in as later phases land. Profile has change password and sign out. |

## Phase 1 — Understand

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T1.1 | Transcript ingestion | §5.1 | P0 | TODO | Mandatory sources: live "Take notes" (primary), `.txt`/`.md`/`.vtt`/`.srt` upload, typed text. Audio file upload and YouTube URL are good-to-have (G2, G12). No video file upload. |
| T1.1.a | File and paste upload with size cap and extension allow-list | §5.1 | P0 | TODO | |
| T1.1.b | Parsers into `TranscriptSegment` with SHA-256 checksum | §5.1 | T1.1.a | TODO | |
| T1.1.c | Regex secret and PII redactor | §5.1, §10 | T1.1.b | TODO | Run before the transcript reaches any LLM. |
| T1.1.d | Typed request input (chat-style) with item type: new feature, bug, or enhancement | §5.1, §5.2 | T1.1.b | TODO | Same pipeline as a transcript; the chosen type is passed to the Analyst as a hint. |
| T1.1.e | Live "Take notes" capture: browser mic plus tab/system audio, chunked upload, faster-whisper transcription into segments | §5.1 | T1.1.b | TODO | Primary path. Also covers a video playing on the user's system. Requires explicit consent before recording. Builds the transcription provider that G2 reuses. |
| T1.1.f | Content moderation gate for all sources | §5.1, §10 | T1.1.b | TODO | Rejects 18+, harassment, and illegal content with a clear reason; nothing is sent to the Analyst. Runs with T1.1.c before any LLM call. |
| T1.2 | Audio transcription | §5.1 | T1.1 | TODO | Live transcription is built in T1.1.e. Audio file upload is good-to-have G2. ID kept so references stay valid. |
| T1.3 | Meeting Analyst | §5.2 | T1.1 | TODO | |
| T1.3.a | Pydantic schema for `RequirementPackage` | §5.2 | P0 | TODO | Items carry `source_segment_ids` and confidence. |
| T1.3.b | LLM call with delimited untrusted transcript | §5.2, §10 | T1.3.a | TODO | No tools, no side effects. |
| T1.3.c | Validation with one repair retry, then fail | §5.2 | T1.3.b | TODO | |
| T1.3.d | Chunk-and-merge for long transcripts | §5.2 | T1.3.c | TODO | |
| T1.3.e | Scope filter: only pure coding work becomes action items | §5.2 | T1.3.a | TODO | Business, ops, and other non-code tasks go to out-of-scope, not to the Planner. |
| T1.4 | Requirement review UI (React) | §9.2 | T1.3, T0.2.d | TODO | Built on the generated API client. |
| T1.4.a | Transcript view with highlighted source spans, linked to requirement items | §9.2 | T1.3.a | TODO | |
| T1.4.b | Edit, split, delete, add items; resolve open questions (React Hook Form + Zod) | §9.2 | T1.4.a | TODO | |
| T1.4.c | Component tests (Vitest, MSW) | §11 | T1.4.b | TODO | |
| T1.4.d | Meetings list and upload/paste pages (`/projects/:id/meetings`, `.../new`) | §9.2 | T1.1.a, T0.2.d | TODO | Upload is Member and Admin only; Non-member sees the list read-only. |
| T1.4.e | "Take notes" button, consent prompt, and recording state (Zoom/Granola style) | §9.2 | T1.1.e, T0.2.d | TODO | Prompts a logged-in user who is in a meeting. See `docs/ui/02_meeting_and_transcription.md` §2.4. |
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
| T2.6 | `PlanChange` flow | §5.3 | T2.5 | TODO | Diff against the approved plan, reason, and approval; only approved changes become Jira sub-tasks later. |
| T2.6.a | Plan change review page (`/plan-changes/:id`) and Approvals inbox (`/approvals`) | §9.2 | T2.6, T1.5, T0.2.d | TODO | Inbox lists pending requirements, plans, and plan changes. Member and Admin only. |
| T2.7 | Phase 2 tests and exit check | §11 | T2.5 | TODO | Exit check: reviewer sees why each file is in scope. |

## Phase 3 — Tracker

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T3.1 | Jira tracker adapter foundation | §5.5 | P2 | TODO | The customer's own Jira Cloud project, Jira REST API v3, behind a `Protocol`. |
| T3.1.a | Auth (site URL, email, API token), project key, issue-type and status mapping, cached transition IDs | §5.5 | P2 | TODO | Mapping covers Backlog, TODO, In Progress, QA, Blocked, Done. |
| T3.1.b | Jira connection settings page and connection test | §5.5, §9.2 | T3.1.a, T0.8 | TODO | Admin only. Token stored encrypted and never returned. The test lists any missing statuses in the project's workflow. |
| T3.1.c | Claude connection settings: Anthropic API key (encrypted), model, local repo folder path, test commands | §5.7, §9.2 | T0.8 | TODO | Admin only. Connection test checks the CLI, the key, and that the folder is a git repo. A subscription login is not supported by default. |
| T3.2 | Backlog ticket creation | §5.5 | T3.1 | TODO | |
| T3.2.a | Create Jira issue with category labels and components (backend, frontend, bug, feature name) and an idempotency key | §5.5 | T3.1.a | TODO | Key = `work_item_id + plan_version`. |
| T3.2.b | Store `ExternalIssue` references (Jira key and ID) | §5.5 | T3.2.a | TODO | |
| T3.3 | Sub-task creation from approved `PlanChange` | §5.5 | T3.2, T2.6 | TODO | |
| T3.4 | TaskTrace board UI and UI commands | §9.2 | T3.2, T0.2.d | TODO | Move, comment, assign, block/unblock; each writes an audit event. |
| T3.4.a | Board with columns and cards (React): Backlog, TODO, In Progress, QA, Blocked, Done | §9.2 | T3.2 | TODO | |
| T3.4.b | "Move to TODO" action and drag and drop (dnd-kit); card reverts if the backend rejects the move | §9.2, §7 | T3.4.a, T3.6 | TODO | The action calls our endpoint, which performs the Jira transition and writes the audit event. Backend remains the only authority on transitions. |
| T3.4.c | Comment, assign, block/unblock dialogs and audit timeline view | §9.2 | T3.4.a | TODO | |
| T3.4.d | Component tests and board drag-and-drop test | §11 | T3.4.b | TODO | |
| T3.4.e | Ticket detail page (`/issues/:key`) | §9.2 | T3.4.a | TODO | Links to plan and requirements, comments, timeline. |
| T3.4.f | Audit timeline pages (per item and project-wide) | §9.2, §9.3 | T0.5, T0.2.d | TODO | Project-wide view is Admin only. |
| T3.4.g | QA to Done action with Definition of Done checklist | §9.2, §5.5 | T3.4.a | TODO | Human only (Member or Admin). The app never sets Done by itself. |
| T3.5 | Polling, optional webhooks, and reconciliation | §5.5 | T3.2 | TODO | |
| T3.5.a | Optional webhook receiver with shared-secret verification | §5.5, §10 | T3.2 | TODO | Off by default; Jira Cloud cannot reach localhost. |
| T3.5.b | Persist `WebhookEvent`, dedupe by event ID | §5.5 | T3.5.a | TODO | |
| T3.5.c | JQL polling of the project (default) | §5.5, §15 | T3.2 | TODO | Every 30–60 s. This is the default change feed. |
| T3.5.d | Beat reconciliation of Jira and internal state | §5.5 | T3.5.c | TODO | |
| T3.6 | Illegal move detection | §5.5, §7 | T3.5.c, T0.4 | TODO | Moves found by polling that bypass our API are flagged with a comment and an audit event. A move to TODO starts a run only if `accept_jira_side_moves` is on (default off). |
| T3.7 | Run trigger on move to TODO | §5.6 | T3.4.b, T3.6 | TODO | Validate project, `backend` category, approved plan link, no active run; create queued `CodingRun`. |
| T3.8 | Phase 3 tests and exit check | §11 | T3.7 | TODO | Exit check: moving a ticket to TODO in the UI creates a queued run exactly once. |

## Phase 4 — Build and Verify

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T4.1 | Local runner | §6 | P3 | TODO | Claude Code runs against the configured local repo folder. No container per run. |
| T4.1.a | Worker image with git, Claude Code CLI, and test tools; repo folder mounted at the configured path | §6 | P3 | TODO | The runner must run on the same machine as the repo. |
| T4.1.b | Clean-tree check and per-task branch creation (`tta/<ticket-key>`) | §6 | T4.1.a | TODO | A dirty tree blocks the run. Nothing is committed or pushed. |
| T4.1.c | Restricted Claude Code tool set and permission mode (edit files, run configured test and lint commands only) | §6 | T4.1.a | TODO | |
| T4.2 | Runner lifecycle in Celery worker | §6 | T4.1 | TODO | Check tree, create branch, run agent, collect `result.json` and the diff. |
| T4.3 | Prompt builder | §5.7 | T2.3 | TODO | Instructions kept separate from untrusted content. |
| T4.4 | Claude Code adapter (`claude -p`) | §5.7 | T4.2, T4.3 | TODO | Uses the user's API key from the encrypted setting. Turn, time, and cost budgets. Agent pauses and requests approval rather than widening scope. |
| T4.5 | Verifier | §5.8 | T4.2 | TODO | |
| T4.5.a | Run tests, lint, type checks | §5.8 | T4.2 | TODO | |
| T4.5.b | Security and secret scans | §5.8 | T4.2 | TODO | |
| T4.5.c | Scope enforcement against allowed and protected paths and diff budget | §5.8, §10 | T4.2 | TODO | Failure blocks the move to QA; the ticket goes to Blocked. |
| T4.5.d | Acceptance-criteria traceability mapping | §5.8 | T4.5.a | TODO | |
| T4.5.e | Verification report generation | §5.8 | T4.5.a, T4.5.b, T4.5.c, T4.5.d | TODO | Includes cost, duration, assumptions, diff summary. |
| T4.6 | Task branch handoff | §6, §5.6 | T4.5 | TODO | MVP handoff path: the user reviews the branch and commits, pushes, and opens PRs manually. GitHub is good-to-have G1. |
| T4.6.a | Leave the task branch with changes uncommitted or committed locally, no push | §6 | T4.5.e | TODO | G1.a adds the push later. |
| T4.6.b | Branch name and diff summary on the ticket and run detail | §5.5 | T4.6.a | TODO | |
| T4.7 | Move ticket to QA with evidence | §5.5 | T4.6 | TODO | App transitions In Progress → QA and comments the report and branch name. Done is human only. |
| T4.8 | Run detail UI (React) | §9.2 | T4.5, T0.2.d | TODO | Live status via TanStack Query polling (3 s), logs, diff, report, branch name. |
| T4.9 | Phase 4 tests and exit check | §11 | T4.7 | TODO | Exit check: an out-of-scope edit is blocked; a good run leaves a branch and moves the ticket to QA. |

## Phase 5 — Hardening

| ID | Task | Arch ref | Depends on | Status | Comments |
|---|---|---|---|---|---|
| T5.1 | Crash recovery | §5.6, §15 | P4 | TODO | `acks_late`, reject on worker lost, beat job re-enqueues stuck runs. |
| T5.2 | Retry cap and failure escalation | §5.6 | P4 | TODO | Escalate to Blocked with a reason. |
| T5.3 | Duplicate and delayed event tests (polling and optional webhooks) | §11 | P4 | TODO | |
| T5.4 | Worker-restart-mid-run test | §11 | T5.1 | TODO | Exit check: no duplicate Jira tickets or runs. |
| T5.5 | Security review | §10 | P4 | TODO | Prompt-injection cases, credential storage, path-scope and clean-tree checks, content moderation bypass. |
| T5.7 | Frontend end-to-end test of the core path (Playwright) | §11 | P4 | TODO | Take notes or upload, approve, move ticket to TODO, view report, move to Done. Optional if time is short. |
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
| G1 | GitHub integration and pull request creation | §5.6, §6 | T4.6 | TODO | Per-project `create_pull_request` setting, default off. In the MVP commit, push, and PR are manual. |
| G1.a | Push the task branch and add pull-request write to a scoped GitHub token | §6 | T4.6.a | TODO | Only when the setting is on. |
| G1.b | Open PR with `Closes #n`, idempotent via `ActivityLog` | §5.6, §8.3 | G1.a | TODO | Retry must never create a duplicate PR. |
| G1.c | Link PR on the Jira ticket and run detail UI | §5.5, §9.2 | G1.b | TODO | |
| G1.d | GitHub merge event comments on the Jira ticket | §5.5, §7 | G1.b | TODO | Done stays human only, even with G1. |
| G1.e | Tests: PR created once, none when setting is off | §11 | G1.b | TODO | |
| G2 | Audio file upload and transcription (faster-whisper, CPU) | §5.1 | T1.1.e | TODO | Replaces T1.2. Reuses the transcription provider from T1.1.e. Live "Take notes" remains the primary path. |
| G3 | MinIO object storage | §8.1 | T0.3 | TODO | Default is the local `artifacts/` volume. |
| G4 | Prometheus and Grafana dashboards | §11 | T5.6 | TODO | |
| G5 | Free fallback coding agent (Aider, OpenHands, or local Ollama) | §12 | T4.4 | TODO | Same adapter contract: prompt file and workspace in, diff and `result.json` out. Lower quality expected. |
| G6 | Semantic retrieval with pgvector | §5.4 | T2.2 | TODO | Add only if deterministic retrieval misses relevant files in P6. |
| G7 | Alternative tracker adapters (Linear, Trello) | §4, §5.5 | T3.1 | TODO | The tracker adapter is already behind a `Protocol`. |
| G8 | Specialist agents | Plan | T6.4 | TODO | Only if the evaluation shows a measured quality, safety, cost, or throughput gain. |
| G9 | Hosted deployment on a free VM | §3, §12 | P5 | TODO | For example Oracle Cloud Always Free. |
| G10 | Server-sent events for live run and board updates | §9.2 | T4.8 | TODO | Replaces polling. Needs an ASGI endpoint. |
| G11 | Scrum assistant (process support, advisory only) | §5.3, §5.6 | T6.4 | TODO | Not the Planner. Suggests, never moves tickets or approves anything. Build only after the single-agent baseline. |
| G11.a | Backlog view with priority field and suggested ordering of work items | §9.2 | T3.4 | TODO | Humans set final priority. |
| G11.b | Effort estimate suggestions per work item | §5.3 | T2.3 | TODO | Based on diff budget and past run data from `CodingRun`. |
| G11.c | Blocker and stale-ticket nudges (comment or notification) | §5.5, §5.6 | T3.5.d | TODO | Reads board and run state; writes comments only. |
| G11.d | Weekly progress summary (completed, blocked, cost, cycle time) | §11 | G11.c | TODO | Page or email digest. |
| G12 | YouTube URL as a source | §5.1 | T1.1.e | TODO | Fetch captions first; download audio and transcribe only as a fallback for videos the user is authorised to use (ToS risk). Implemented later. |
