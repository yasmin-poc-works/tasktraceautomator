# UI Design Module 4 — Traceable GitHub Project Board & Ticket Detail

This module specifies the Kanban board UI, GitHub Project item synchronization, drag-and-drop state transitions, plan-change sub-issues, and the ticket inspection view.

---

## 4.1 Traceable GitHub Project Board (`/projects/:id/board`)

### Purpose
The primary execution interface. Users move issues between columns, monitor coding run status, and track GitHub synchronization without needing to open GitHub directly.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: [Core API ▼]      [Meetings]  [Board]  [Settings]  [Alex (PO)] |
+--------------------------------------------------------------------------------------------------+
|  GitHub Project Board: Core Platform (acme #3)  (Sync: Live ✓ | Last synced: 12s ago)  [ Sync Now ⟳ ]  [ + New ]
|                                                                                                  |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|  | BACKLOG (2)    |  | TODO (1)       |  | IN PROGRESS (1)|  | QA (1)         |  | DONE (4)      |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|  | [#105]     |  | [#104]     |  | [#102]     |  | [#98]      |  | [#90]                         |
|  | Webhook Ingest |  | Create GitHub    |  | JWT Bearer     |  | Project Model  |  | Initial Repo  |
|  | HMAC verify    |  | API Client     |  | Authentication |  | & Migration    |  | Scaffold      |
|  |                |  |                |  |                |  |                |  |               |
|  | 🎙 Meeting: S43|  | 🎙 Meeting: S43|  | ⚙ Coding Agent |  | 🔍 Verification|  | 🎙 Meeting:S41    |
|  | Plan: v1.0     |  | Plan: v1.0     |  | Turn 4/8...    |  | 14/14 PASS     |  | Human-tested  |
|  | [GitHub ↗]       |  | [GitHub ↗]       |  | [GitHub ↗]       |  | [Review Diff ↗]|  | [GitHub ↗]      |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|  | [#106]     |  |                |  |                |  |                |                      |
|  | PII Redaction  |  |                |  |                |  |                |  |               |
|  | Regex filters  |  |                |  |                |  |                |  |               |
|  | 🎙 Meeting: S43|  |                |  |                |  |                |                   |
|  | Plan: v1.0     |  |                |  |                |  |                |  |               |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|                                                                                                  |
|  Notice: Moving a card from BACKLOG to TODO (button or drag) enqueues a Claude Code run on the   |
|  local backend folder. When tests pass the app moves the card to QA. Only a person moves it to   |
|  DONE, after manual testing. Illegal moves revert with a reason.                                 |
+--------------------------------------------------------------------------------------------------+
```

### Components & State Machine
1. **Card Component**:
   - Top Bar: issue reference with direct link (`acme/core-platform#104 ↗`), priority icon, assignee avatar.
   - Title: Short summary.
   - Traceability Pill: `🎙 Meeting: Sprint 43 (04:12)` (clicking pops up the audio player).
   - Status Indicator: Live coding progress badge (`Turn 4/8` or `Verifying...`).
2. **Drag & Drop Interaction (`dnd-kit`)**:
   - Each BACKLOG card has a **[Move to TODO]** button; dragging the card to **TODO** does the same.
     - Sends `POST /api/issues/104/transition/` with `target_status: "TODO"`.
     - Our API sets the Project item's Status through the GitHub MCP server and writes an audit event (user, time, issue reference), so the move is traced.
     - Enqueues the `CodingRun` Celery task. Only `backend` tickets are auto-run in the MVP; `frontend` tickets stay in TODO with a "Frontend runs are not enabled yet" note.
   - The app moves the card to **IN PROGRESS** when the run starts and to **QA** when tests pass, with the evidence as a GitHub comment. A failed run moves it to **BLOCKED** with the reason.
   - **QA → DONE** is a human action only. The `[Mark Done]` button opens a Definition of Done checklist; the app never sets Done by itself.
   - Moves made directly on the GitHub Project board are detected by polling and flagged; the UI is the supported path.
   - If an unauthorized user attempts to drag or an illegal transition occurs:
     - Card smoothly snaps back to its origin column with a red toast: *"Transition rejected: Missing requirements approval"*.

---

## 4.2 Ticket Detail & Traceability Inspector (`/issues/:issue_ref`)

### Purpose
Provides full inspection of a GitHub issue, including the linked meeting audio snippet, verbatim spoken intent, technical acceptance criteria, plan changes, and verification report.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   [ ◀ Back to Board ]                                                 |
+--------------------------------------------------------------------------------------------------+
|  GitHub Issue: #104                                               Status: [ IN PROGRESS ▼ ]      |
|  Summary: Call GitHub MCP tools to create backlog issues from approved plans                     |
|  GitHub Link: https://github.com/acme/core-platform/issues/104 [Open in GitHub ↗]                |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | 🎙 SPOKEN PROVENANCE & AUDIO REPLAY                                                         |  |
|  | Meeting: Sprint 43 Architecture Alignment                                                  |  |
|  | Speaker: Sarah (Product Owner) at 04:12 UTC                                                |  |
|  | [▶ Play Audio Segment]  04:12 / 04:45  [=====================|==============]              |  |
|  |                                                                                            |  |
|  | Spoken Quote:                                                                              |  |
|  | "We are definitely using GitHub for this sprint. We need automated ticket creation         |  |
|  | with all acceptance criteria so engineers don't have to guess what we agreed."             |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | 📋 ACCEPTANCE CRITERIA TRACEABILITY                                                         |  |
|  | [x] AC 1: Planner creates issue via MCP with Markdown body    (Verified by test_github_create_issue)    |  |
|  | [x] AC 2: Idempotent marker lookup                        (Verified by test_github_idempotent)
|  | [ ] AC 3: GitHub sub-issue generation for plan revisions    (In progress...)               |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | ⑂ SCOPE CHANGES & SUB-ISSUES (Anti-Vibe-Coding Guard)                                      |  |
|  | Never edit the original ticket silently. Proposed scope changes create GitHub sub-issues:  |  |
|  |                                                                                            |  |
|  | • Sub-issue [#107, child of #104]: Add custom priority field mapping   Status: [DONE]      |  |
|  |                                                                                            |  |
|  | [ + Propose Plan Change / New Sub-issue ]                                                  |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | 📜 AUDIT TIMELINE                                                                           |  |
|  | 2026-10-28 11:15 AM - Requirements approved by Sarah (PO)                                  |  |
|  | 2026-10-28 11:20 AM - Technical Plan v1.0 approved by Dave (Tech Lead)                     |  |
|  | 2026-10-28 11:21 AM - GitHub issue #104 created in Project backlog by the Planner agent    |  |
|  | 2026-10-28 11:25 AM - Card moved to TODO (Status field); Coding Run #12 started on branch t|  |
|  +--------------------------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------+
```

---

## 4.3 Plan Change & GitHub Sub-Issue Creation Modal

### Purpose
When new scope is identified during development, this modal ensures the original ticket is preserved and an official GitHub sub-issue is generated with its own approval gate.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|                                  Propose Scope Change / Sub-issue                                |
+--------------------------------------------------------------------------------------------------+
|  Parent Issue: [#104] Call GitHub MCP tools to create backlog issues                             |
|                                                                                                  |
|  Reason for Modification:                                                                        |
|  [ Status updates need the Project item ID, so the adapter must cache field and option IDs.  ]   |
|                                                                                                  |
|  Proposed Sub-issue Summary:                                                                     |
|  [ Implement Project field/option ID cache for Status updates                                ]   |
|                                                                                                  |
|  Diff against Approved Plan:                                                                     |
|  + Add api/providers/tracker/project_fields.py to allowed paths.                                 |
|  + Add 1 new unit test in tests/unit/test_project_fields.py.                                     |
|                                                                                                  |
|  [ Cancel ]                                          [ Submit Sub-issue for Approval ↗ ]         |
+--------------------------------------------------------------------------------------------------+
```

