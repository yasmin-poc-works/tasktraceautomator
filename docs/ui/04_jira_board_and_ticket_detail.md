# UI Design Module 4 — Traceable Jira Board & Ticket Detail

This module specifies the Kanban board UI, Jira card synchronization, drag-and-drop state transitions, plan-change sub-tasks, and the ticket inspection view.

---

## 4.1 Traceable Jira Kanban Board (`/projects/:id/board`)

### Purpose
The primary execution interface. Users move issues between columns, monitor coding run status, and track Jira synchronization without needing to open the Jira workspace directly.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: [Core API ▼]      [Meetings]  [Board]  [Settings]  [Alex (PO)] |
+--------------------------------------------------------------------------------------------------+
|  Jira Board: CORE Platform Sprint (Sync: Live ✓ | Last synced: 12s ago)   [ Sync Now ⟳ ]  [ + New ]
|                                                                                                  |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|  | BACKLOG (2)    |  | TODO (1)       |  | IN PROGRESS (1)|  | QA (1)         |  | DONE (4)      |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|  | [CORE-105]     |  | [CORE-104]     |  | [CORE-102]     |  | [CORE-98]      |  | [CORE-90]     |
|  | Webhook Ingest |  | Create Jira    |  | JWT Bearer     |  | Project Model  |  | Initial Repo  |
|  | HMAC verify    |  | API Client     |  | Authentication |  | & Migration    |  | Scaffold      |
|  |                |  |                |  |                |  |                |  |               |
|  | 🎙 Meeting: S43|  | 🎙 Meeting: S43|  | ⚙ Coding Agent |  | 🔍 Verification|  | 🎙 Meeting:S41|
|  | Plan: v1.0     |  | Plan: v1.0     |  | Turn 4/8...    |  | 14/14 PASS     |  | Human-tested  |
|  | [Jira ↗]       |  | [Jira ↗]       |  | [Jira ↗]       |  | [Review Diff ↗]|  | [Jira ↗]      |
|  +----------------+  +----------------+  +----------------+  +----------------+  +---------------+
|  | [CORE-106]     |  |                |  |                |  |                |  |               |
|  | PII Redaction  |  |                |  |                |  |                |  |               |
|  | Regex filters  |  |                |  |                |  |                |  |               |
|  | 🎙 Meeting: S43|  |                |  |                |  |                |  |               |
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
   - Top Bar: Jira Key with direct link (`CORE-104 ↗`), priority icon, assignee avatar.
   - Title: Short summary.
   - Traceability Pill: `🎙 Meeting: Sprint 43 (04:12)` (clicking pops up the audio player).
   - Status Indicator: Live coding progress badge (`Turn 4/8` or `Verifying...`).
2. **Drag & Drop Interaction (`dnd-kit`)**:
   - Each BACKLOG card has a **[Move to TODO]** button; dragging the card to **TODO** does the same.
     - Sends `POST /api/issues/CORE-104/transition/` with `target_status: "TODO"`.
     - Our API performs the Jira transition through the Jira REST API and writes an audit event (user, time, key), so the move is traced.
     - Enqueues the `CodingRun` Celery task. Only `backend` tickets are auto-run in the MVP; `frontend` tickets stay in TODO with a "Frontend runs are not enabled yet" note.
   - The app moves the card to **IN PROGRESS** when the run starts and to **QA** when tests pass, with the evidence as a Jira comment. A failed run moves it to **BLOCKED** with the reason.
   - **QA → DONE** is a human action only. The `[Mark Done]` button opens a Definition of Done checklist; the app never sets Done by itself.
   - Moves made directly in Jira are detected by polling and flagged; the UI is the supported path.
   - If an unauthorized user attempts to drag or an illegal transition occurs:
     - Card smoothly snaps back to its origin column with a red toast: *"Transition rejected: Missing requirements approval"*.

---

## 4.2 Ticket Detail & Traceability Inspector (`/issues/:jira_key`)

### Purpose
Provides full inspection of a Jira ticket, including the linked meeting audio snippet, verbatim spoken intent, technical acceptance criteria, plan changes, and verification report.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   [ ◀ Back to Board ]                                                 |
+--------------------------------------------------------------------------------------------------+
|  Jira Issue: CORE-104                                               Status: [ IN PROGRESS ▼ ]    |
|  Summary: Call Jira Cloud REST API v3 to create backlog issues from approved plans               |
|  Jira Link: https://tasktrace.atlassian.net/browse/CORE-104 [Open in Jira ↗]                     |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | 🎙 SPOKEN PROVENANCE & AUDIO REPLAY                                                         |  |
|  | Meeting: Sprint 43 Architecture Alignment                                                  |  |
|  | Speaker: Sarah (Product Owner) at 04:12 UTC                                                 |  |
|  | [▶ Play Audio Segment]  04:12 / 04:45  [=====================|==============]               |  |
|  |                                                                                            |  |
|  | Spoken Quote:                                                                              |  |
|  | "We are definitely using Jira Cloud for this sprint. We need automated ticket creation    |  |
|  | with all acceptance criteria so engineers don't have to guess what we agreed."             |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | 📋 ACCEPTANCE CRITERIA TRACEABILITY                                                        |  |
|  | [x] AC 1: Successful Jira POST request with ADF body       (Verified by test_jira_post)     |  |
|  | [x] AC 2: Idempotent dispatch key handling                (Verified by test_jira_idempotent)
|  | [ ] AC 3: Jira sub-task generation for plan revisions    (In progress...)                 |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | ⑂ SCOPE CHANGES & SUB-TASKS (Anti-Vibe-Coding Guard)                                      |  |
|  | Never edit the original ticket silently. Proposed scope changes create Jira sub-tasks:    |  |
|  |                                                                                            |  |
|  | • Sub-task [CORE-104-1]: Add custom priority field mapping   Status: [DONE]                 |  |
|  |                                                                                            |  |
|  | [ + Propose Plan Change / New Sub-task ]                                                   |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | 📜 AUDIT TIMELINE                                                                          |  |
|  | 2026-10-28 11:15 AM - Requirements approved by Sarah (PO)                                  |  |
|  | 2026-10-28 11:20 AM - Technical Plan v1.0 approved by Dave (Tech Lead)                     |  |
|  | 2026-10-28 11:21 AM - Jira ticket CORE-104 created in Cloud backlog                         |  |
|  | 2026-10-28 11:25 AM - Card moved to TODO; Coding Run #12 launched in container            |  |
|  +--------------------------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------+
```

---

## 4.3 Plan Change & Jira Sub-Task Creation Modal

### Purpose
When new scope is identified during development, this modal ensures the original ticket is preserved and an official Jira Sub-task is generated with its own approval gate.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|                                  Propose Scope Change / Sub-task                                 |
+--------------------------------------------------------------------------------------------------+
|  Parent Issue: [CORE-104] Call Jira Cloud REST API v3 to create backlog issues                   |
|                                                                                                  |
|  Reason for Modification:                                                                        |
|  [ Jira Cloud API requires Atlassian Document Format (ADF) version 1 structure for comments.   ] |
|                                                                                                  |
|  Proposed Sub-task Summary:                                                                      |
|  [ Implement Atlassian ADF Comment Serializer                                                  ] |
|                                                                                                  |
|  Diff against Approved Plan:                                                                     |
|  + Add api/providers/tracker/adf_serializer.py to allowed paths.                                 |
|  + Add 1 new unit test in tests/unit/test_adf.py.                                                |
|                                                                                                  |
|  [ Cancel ]                                          [ Submit Sub-task for Approval ↗ ]          |
+--------------------------------------------------------------------------------------------------+
```

