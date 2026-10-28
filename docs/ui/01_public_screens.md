# UI Design Module 1 — Public Screens (Unauthenticated)

This module details the screens accessible to external visitors and unauthenticated users without logging in.

---

## 1.1 Public Landing Page (`/`)

### Purpose
Communicates the core value proposition: stopping "vibe coding" errors by establishing a bulletproof audit trail from meeting audio to Jira tickets and verified code.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator               Features    How It Works    Docs    [Try Demo] [Sign In]|
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ Badge: Anti-Vibe-Coding Platform ]                                                           |
|   Turn Meeting Decisions into Auditable Jira Tickets & Verified Code                             |
|                                                                                                  |
|   Stop losing requirements in chat prompts. TaskTraceAutomator transcribes your sprint planning, |
|   extracts verified acceptance criteria with timestamps, and generates traceable Jira tickets.   |
|                                                                                                  |
|              [ Explore Live Demo ]          [ Sign In to Workspace ]                             |
|                                                                                                  |
|--------------------------------------------------------------------------------------------------|
|   Interactive Comparison: Why "Vibe Coding" Fails vs. TaskTraceAutomator                        |
|                                                                                                  |
|   [ Traditional "Vibe Coding" ]                 |   [ TaskTraceAutomator Governed Flow ]         |
|   X Meeting decisions lost in chat history       |   ✓ Every ticket cites exact audio timestamp   |
|   X AI silently modifies out-of-scope files     |   ✓ Strict file allow-lists & human sign-off   |
|   X Untraceable bugs; no Jira tickets created   |   ✓ Jira backlog tickets created automatically |
|   X No proof that code satisfies DoD            |   ✓ Verification scanner maps tests to criteria|
|                                                                                                  |
|--------------------------------------------------------------------------------------------------|
|   How It Works in 3 Steps:                                                                       |
|                                                                                                  |
|   [ 1. Transcribe & Ground ]      [ 2. Plan & Human Gate ]        [ 3. Traceable Jira Tickets ]  |
|   Upload audio or notes. Every    Review extracted items. PO      Auto-creates Jira tickets with |
|   requirement links to a speaker  signs off before any technical  acceptance criteria and links  |
|   and timestamp.                  plan is generated.              to the meeting recording.      |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Components & Interaction Design
- **Hero CTA**: "Explore Live Demo" deep-links directly to `/demo` with zero login required.
- **Interactive Provenance Visualizer**: A visual pill that lets the user click:
  `[PO @ 04:12: "We must enforce JWT auth with 15min expiry"]` $\longrightarrow$ `[Jira Ticket: PROJ-102 Acceptance Criteria #2]`
- **Footer**: Links to OpenAPI docs (`/api/docs/`), GitHub repository, and architecture documentation.

---

## 1.2 Public Interactive Demo (`/demo`)

### Purpose
Allows any prospective user, manager, or stakeholder to interactively experience the meeting-to-Jira flow in read-only mode using a pre-loaded sample sprint meeting.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   [Interactive Demo: Sprint Planning 42]   [Sign In to Create Project]|
+--------------------------------------------------------------------------------------------------+
|  [Banner: Interactive Sandbox — Read Only. Click any sentence below to see its linked Jira ticket]  |
+-------------------------------------------------+------------------------------------------------+
|  LEFT: Spoken Meeting Transcript                |  RIGHT: Extracted Traceable Jira Ticket        |
+-------------------------------------------------+------------------------------------------------+
|  [>] 00:00 / 08:35  [====|==============]  1.0x |  Jira Key: [PROJ-84]  Type: [Story]  Status: [TODO]
|                                                 |  Summary: Add JWT Bearer Auth with Token Rotation|
|  [01:14] Sarah (Product Owner):                 |                                                |
|  "Let's make sure authentication uses JWT with  |  Origin: Spoken by Sarah at 01:14 [Listen ▶]    |
|  a 15-minute access token. Refresh token should |                                                |
|  last for 7 days."                              |  Acceptance Criteria (Given/When/Then):        |
|                                                 |  • Given valid credentials, When user logs in, |
|  [01:45] Dave (Tech Lead):                      |    Then return 15-min JWT access token.        |
|  "Agreed. And on logout, we must blacklist the  |  • Given expired access token, When refresh    |
|  refresh token in Redis so it can't be reused." |    endpoint is called, Then issue new pair.    |
|                                                 |  • Given user logs out, When refresh token is  |
|  [02:10] Sarah:                                 |    used, Then return 401 Unauthorized.         |
|  "Also, the client must keep access tokens in   |                                                |
|  memory only, not localStorage."                |  Definition of Done:                           |
|                                                 |  [x] simplejwt configured in settings.py       |
|                                                 |  [x] Blacklist app enabled in Django           |
|                                                 |  [x] Memory-only token store in React client   |
|                                                 |                                                |
|                                                 |  [ View in Jira Cloud ↗ ]  [ Inspect Audit Trail ]
+-------------------------------------------------+------------------------------------------------+
```

### Components & Interaction Design
- **Audio Waveform / Timestamp Scrubbing**: Clicking on `[Listen ▶]` jumps the audio player directly to that second.
- **Bi-Directional Highlighting**:
  - Clicking on a sentence in the left transcript highlights the corresponding requirement card on the right.
  - Hovering over an acceptance criterion in the right card highlights the exact transcript segment on the left in cyan.

---

## 1.3 Public Ticket Traceability Inspector (`/trace/:ticket_key`)

### Purpose
A public, shareable permalink that anyone (including clients, security auditors, or team members without direct platform accounts) can use to audit the origin and verification of a specific Jira ticket.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator                Traceability Verification Report        [Verify Another]|
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Ticket Key: PROJ-84  |  Project: Core Platform  |  Approved By: Alex (PO) on 2026-10-24         |
|   Summary: Implement JWT Bearer Authentication and Refresh Rotation                              |
|                                                                                                  |
|   PROVENANCE CHAIN                                                                               |
|   ============================================================================================   |
|                                                                                                  |
|   [ 1. Meeting Audio Source ]                                                                    |
|   Recorded in: "Sprint 42 Architecture Alignment" on 2026-10-24 10:00 AM                         |
|   Audio Segment: 01:14 - 02:30 (Speaker: Sarah, Product Owner)                                   |
|   Spoken Intent: "Let's make sure authentication uses JWT with a 15-minute access token..."      |
|   [ Play Audio Snippet ▶ ]                                                                        |
|                                                                                                  |
|   [ 2. Human Approval Gate ]                                                                     |
|   Approved By: Alex Rivera (Approver) at 2026-10-24 11:15 AM UTC                                 |
|   Plan Version: v1.0 (Immutable SHA-256: 8f2b...c41a)                                            |
|                                                                                                  |
|   [ 3. Jira Backlog Synchronization ]                                                            |
|   Jira Issue Created: PROJ-84 at 2026-10-24 11:16 AM UTC                                        |
|   Direct Jira Link: https://tasktrace.atlassian.net/browse/PROJ-84 [Open Jira ↗]                 |
|                                                                                                  |
|   [ 4. Verification & Evidence ]                                                                 |
|   Code Branch: tta/issue-PROJ-84                                                                 |
|   Tests Passing: 14/14 unit tests | Scope check: 100% within allowed paths                        |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 1.4 Authentication Screens (`/login`, `/register`)

### Purpose
Provides secure JWT bearer token authentication with role-aware redirection.

### ASCII Wireframe: Login Screen (`/login`)
```text
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|                                     [Logo: TaskTraceAutomator]                                   |
|                                    Sign in to your team workspace                                |
|                                                                                                  |
|                           +-----------------------------------------------+                      |
|                           |  Username or Work Email                       |                      |
|                           |  [ alex@company.com                         ] |                      |
|                           +-----------------------------------------------+                      |
|                           |  Password                                     |                      |
|                           |  [ *********************                  👁 ] |                      |
|                           +-----------------------------------------------+                      |
|                           |  [ ] Remember this machine on this network    |                      |
|                           +-----------------------------------------------+                      |
|                           |                 [ Sign In ]                   |                      |
|                           +-----------------------------------------------+                      |
|                                                                                                  |
|                           Don't have an account? [Request Access / Register]                     |
|                           Or explore first: [View Interactive Demo ↗]                            |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Components & State Machine
- Tokens are held **in memory only** (not stored in `localStorage` to prevent XSS exfiltration).
- Silent refresh happens automatically via refresh token cookie/endpoint on 401.
- Role-based redirect on success:
  - Admins & Members $\longrightarrow$ Project Dashboard (`/dashboard`).
  - Viewers $\longrightarrow$ Assigned Project Board (`/projects/:id/board`).

