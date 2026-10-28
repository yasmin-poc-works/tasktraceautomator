# TaskTraceAutomator — Implementation Plan

**Sources:** [Product plan](../architecture/task_trace_automator_plan.md) · [HLD](../architecture/task_trace_automator_hld.md) · [Architecture](../architecture/task_trace_automator_architecture.md)
**Task tracker:** [task.md](task.md)

## 1. Objective

Build the MVP path: meeting input → action items → plan → Jira backlog ticket → Move to TODO → Claude Code run on the local backend folder → verification → QA → human Done. TaskTraceAutomator orchestrates the customer's own Jira and Claude Code; it does not replace them. Every consequential step needs human approval, the app never sets Done, and nothing merges automatically. Commit, push, and PR are manual.

## 2. Guiding Constraints

- One coding agent with staged responsibilities. No specialist agents until evaluation shows a measured benefit.
- Free or low-cost stack (Django, Celery, Postgres, Docker). Jira and Claude Code are the customer's own; their credentials are entered in the UI and stored encrypted.
- MVP codes the **backend only**. Frontend tickets are created in Jira but not auto-run until the next MVP.
- Typed, versioned artifacts, not chat history, carry context between stages.
- Authentication uses JWT bearer tokens. Three roles: Admin (Full access), Member (Approver access), Non-member (Viewer access). Viewer and Approver are access levels, not roles; the API enforces them (Architecture §9.3).
- The UI is a React + TypeScript SPA. It talks only to the DRF API through a client generated from the OpenAPI schema, and the backend stays the sole authority on workflow rules.
- GitHub integration and pull request creation are a **good-to-have** (G1). In the MVP the task branch, diff, and verification report are the handoff and the user commits, pushes, and opens PRs manually.
- Good-to-have items (section 9) are never prerequisites for MVP exit checks. If time is short, drop them in the order listed there.

## 3. Phases

| Phase | Name | Deliverable | Exit check | Architecture ref |
|---|---|---|---|---|
| 0 | Foundation | Compose stack, Django apps, React frontend scaffold with generated API client, models, audit, state machine, auth | Transitions are tested and idempotent | §7, §8, §13 |
| 1 | Understand | Take notes (live capture), file and typed input, moderation, Meeting Analyst, action-item review UI, approvals | A draft package is corrected and approved | §5.1, §5.2, §5.9 |
| 2 | Plan | Planner, Context Builder, plan review with allow-list, plan versions | Reviewer can see why each file is in scope | §5.3, §5.4 |
| 3 | Tracker | Jira and Claude connection settings, Jira ticket creation, board UI, Move to TODO, polling and reconciliation, `PlanChange` sub-tasks | Moving a ticket to TODO in the UI creates a queued run exactly once | §5.5, §5.6, §9 |
| 4 | Build and verify | Local runner, Claude Code adapter, scope enforcement, scanners, report, move to QA | An out-of-scope edit is blocked; a good run leaves a task branch and moves the ticket to QA | §5.7, §5.8, §6 |
| 5 | Hardening | Retry cap, crash recovery, duplicate and delayed webhook tests | Restarting a worker mid-run creates no duplicate Jira tickets or runs | §10, §11, §15 |
| 6 | Evaluation | Fixed evaluation set, metrics | Report compares the staged agent against a manual baseline | Plan §evaluation |

Phases run in order. Within a phase, tasks marked as independent in task.md can run in parallel.

## 4. Dependencies

```text
P0 ──> P1 ──> P2 ──> P3 ──> P4 ──> P5 ──> P6
```

- P3 needs the approved plan model from P2.
- P4 needs the run orchestrator and state machine from P0 and P3.
- P5 tests exercise the real P3 and P4 flows, so it cannot start earlier.

## 5. Definition of Done (per task)

1. Code merged to `main` through normal repository review.
2. Unit tests added or updated and passing; lint and type checks clean.
3. Audit events written for every state change the task introduces.
4. Docs updated where behavior or configuration changed.
5. The task's row in [task.md](task.md) is set to `COMPLETE` with a comment naming the commit or PR.

## 6. Traceability Scheme

| ID pattern | Meaning | Example |
|---|---|---|
| `P<n>` | Phase | `P3` |
| `T<phase>.<n>` | Task | `T3.2` |
| `T<phase>.<n>.<letter>` | Subtask of a larger task | `T3.2.a` |

Each task row in task.md carries an **Arch ref** column pointing to the architecture section it implements. Subtasks are used when a task would take more than about two days or touches more than one component.

## 7. Status Rules for task.md

| Status | Meaning |
|---|---|
| `TODO` | Not started. Default for every new task. |
| `IN_PROGRESS` | Work has started and is not finished. Keep this status until done. |
| `BLOCKED` | Cannot proceed. The Comments column must name the blocker. Keep this status until it is cleared. |
| `COMPLETE` | Done and meets the Definition of Done. Set only on completion. |

- A parent task becomes `COMPLETE` only when all its subtasks are `COMPLETE`.
- A parent is `IN_PROGRESS` if any subtask is, and `BLOCKED` if any subtask is blocked and none are in progress.
- Every status change needs a dated entry in the Comments column.

## 8. Risks and Open Decisions

| Item | Handling |
|---|---|
| Commit, push, and PR | Decided: manual in the MVP. GitHub is good-to-have G1. |
| Jira Cloud cannot reach webhooks on localhost | Polling is the default (T3.5.c); webhooks are optional. |
| Users move tickets directly in Jira | UI is the supported path; polling flags illegal moves; the app never sets Done. |
| Using a Claude subscription login inside another product | Default to the user's API key; check Anthropic's terms before supporting a login. |
| Free LLM tiers return weak JSON | Pydantic validation with one repair retry; chunking (T1.3). |
| Claude Code cost | Customer's own key; budget caps in T4.4; small tasks only. Free fallback agent is G5. |
| Celery lacks Temporal-style replay | `ActivityLog` idempotency and a reconciliation beat job (T0.5, T5.1). |
| Two codebases (Python and TypeScript) double tooling and testing | Generated API client and CI drift check keep them in sync; frontend kept thin, no business rules in the SPA. |
| Scope creep toward multi-agent | Single-agent baseline in P6 first. Specialist agents are G8. |

## 9. Good-to-Have Options

Optional enhancements tracked in the Good-to-Have section of [task.md](task.md). They are listed in the order to drop them when time is short (first listed is dropped last).

| ID | Option | Why it is optional | Enable when |
|---|---|---|---|
| G1 | GitHub integration and pull request creation | Task branch, diff, and report already give a reviewable handoff; commit, push, and PR are manual | A team wants automated PRs |
| G2 | Audio file upload (faster-whisper) | Live Take notes is the primary path | Users have recordings |
| G12 | YouTube URL as a source | Live capture covers a video playing on the system | Teams need to ingest recorded talks |
| G5 | Free fallback coding agent | Claude Code is the required agent | Cost or access blocks Claude Code |
| G6 | pgvector semantic retrieval | Deterministic retrieval comes first | P6 shows missed relevant files |
| G7 | Alternative trackers (Linear, Trello) | Jira covers the MVP | A team already works in another tracker |
| G9 | Hosted deployment on a free VM | Docker Compose on a laptop is enough | Webhooks or shared access need a stable host |
| G3 | MinIO object storage | Local volume is enough | Artifacts outgrow the local volume |
| G4 | Prometheus and Grafana | Structured logs are enough | Operating the system needs dashboards |
| G8 | Specialist agents | Single-agent baseline first | Evaluation shows a measured gain |
| G10 | Server-sent events | Polling every 3 s is enough | Polling load or latency becomes a problem |
| G11 | Scrum assistant (priorities, estimates, blocker nudges, weekly summary) | The Planner only writes technical plans; humans and the state machine run the process | Teams want process support beyond the board; after the single-agent baseline |

G1 later: the app could push the task branch and open a PR once (idempotent) and link it on the ticket. In the MVP the human commits, pushes, and moves the ticket to Done after manual testing against the Definition of Done.
