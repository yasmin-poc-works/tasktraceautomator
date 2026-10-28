# UI Design Module 3 — Technical Planning & GitHub Issue Generation

This module details how approved requirements are converted into technical implementation plans, how file scope is strictly bounded, and how traceable GitHub issues are generated.

---

## 3.1 Technical Implementation Plan Review (`/work-items/:id/plan`)

### Purpose
Before any GitHub issue is created or any code is modified, the Engineering Lead reviews the Planner Agent's breakdown. This includes Given/When/Then acceptance criteria, Definition of Done, allowed files, and test commands.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Work Item #42: Automated GitHub Issue Creation    [Plan Version: v1.0]
+--------------------------------------------------------------------------------------------------+
|  <- Back to Meeting Requirements                                                                 |
|  Linked Meeting: Sprint 43 Architecture Alignment (Spoken by Sarah at 04:12)                     |
|                                                                                                  |
|  Summary: Call GitHub MCP tools to create backlog issues from approved plans                     |
|                                                                                                  |
|  [ Section 1: Acceptance Criteria (Given / When / Then) ]                                        |
|  +--------------------------------------------------------------------------------------------+  |
|  | AC 1: Successful Ticket Creation                                                           |  |
|  | Given an approved ImplementationPlan v1.0,                                                 |  |
|  | When the user triggers "Create GitHub Issue",                                              |  |
|  | Then the Planner agent calls the MCP create-issue tool with a Markdown body                |  |
|  | And store owner/repo#104, node ID, and Project item ID in ExternalIssue.                   |  |
|  |                                                                                            |  |
|  | AC 2: Idempotent Dispatch                                                                  |  |
|  | Given an existing ExternalIssue for plan version v1.0,                                     |  |
|  | When a retry or duplicate request occurs,                                                  |  |
|  | Then return the existing ticket reference without creating a duplicate in GitHub.          |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  [ Section 2: Definition of Done (DoD) Checklist ]                                               |
|  [x] Unit tests for GitHubAdapter using recorded MCP tool-call fixtures (pytest)                 |
|  [x] Encrypted storage for GitHub MCP Token in Project settings                                  |
|  [x] Markdown issue body builder with idempotency marker implemented                             |
|  [x] Append-only audit log entry recorded on ticket creation                                     |
|                                                                                                  |
|  [ Section 3: Bounded Scope & Path Policy (Anti-Vibe-Coding Guard) ]                             |
|  The AI Coding Agent will ONLY be allowed to touch these files. All other files are protected:   |
|  +--------------------------------------------------------------------------------------------+  |
|  | Allowed Files to Modify / Create:                      | Protected Paths (Strict Block):   |  |
|  | • api/providers/tracker/github.py                       | • api/config/settings.py         |  |
|  | • api/apps/integrations/models.py                     | • api/apps/audit/*                 |  |
|  | • api/tests/unit/test_github_adapter.py                 | • docker-compose.yml             |  |
|  +--------------------------------------------------------------------------------------------+  |
|  Execution Budget: Max turns: 8 | Wall timeout: 10 mins | Max diff size: 250 lines               |
|                                                                                                  |
|                                [ Edit Plan Scope ]    [ APPROVE PLAN & CREATE GITHUB ISSUE 🚀 ]   |
+--------------------------------------------------------------------------------------------------+
```

---

## 3.2 GitHub Issue Creation Preview Modal

### Purpose
Appears when the engineer clicks "APPROVE PLAN & CREATE GITHUB ISSUE". Allows reviewing the exact GitHub issue format before the Planner agent creates it on GitHub.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|                                    Confirm & Create GitHub Issue                                 |
+--------------------------------------------------------------------------------------------------+
|  TaskTraceAutomator's Planner agent will create a backlog issue in your GitHub repo:             |
|                                                                                                  |
|  Target Repository:     [ acme/core-platform (Connected via GitHub MCP ✓) ]                      |
|  Target Project:        [ #3 Core Platform Board ▼ ]    Status: [ Backlog ]                      |
|  Labels:                [ backend ✕ ] [ feature ✕ ]       Priority: [ High ▼ ]                   |
|                                                                                                  |
|  PREVIEW OF ISSUE IN GITHUB:                                                                     |
|  +--------------------------------------------------------------------------------------------+  |
|  | Summary: Call GitHub MCP tools to create backlog issues from approved plans                |  |
|  |                                                                                            |  |
|  | Description:                                                                               |  |
|  | 🎙 Meeting Provenance:                                                                      |  |
|  | Spoken by Sarah (Product Owner) during "Sprint 43 Architecture Alignment" (04:12)          |  |
|  | Quote: "We are definitely using GitHub for this sprint. We need automated ticket           |  |
|  | creation with all acceptance criteria so engineers don't have to guess..."                 |  |
|  | Verified Audio Link: http://tasktrace.local/trace/req-42 [Listen ▶]                        |  |
|  |                                                                                            |  |
|  | 📋 Acceptance Criteria:                                                                     |  |
|  | • Given approved ImplementationPlan v1.0, When triggered, Then call the MCP create-issue tool|  |
|  | • Given existing ExternalIssue, When retried, Then return existing key without duplicating.|  |
|  |                                                                                            |  |
|  | 🏁 Definition of Done:                                                                      |  |
|  | • Unit tests with mocked fixtures passing.                                                 |  |
|  | • Scoped strictly to api/providers/tracker/github.py.                                      |  |
|  |                                                                                            |  |
|  | 🔒 Traceability Metadata:                                                                   |  |
|  | Marker: <!-- tta:work_item=wi-849204;plan=v1.0 --> | Plan SHA: 7b84...e21a                 |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|                                [ Cancel ]      [ Confirm & Publish to GitHub Backlog ↗ ]         |
+--------------------------------------------------------------------------------------------------+
```

### Components & State Machine
1. **GitHub MCP Dispatch (Planner agent, allow-listed tools)**:
   - Before creating, the adapter searches for the body marker `<!-- tta:work_item=<id>;plan=<version> -->`; if found, it reuses the existing issue (idempotent).
   - Otherwise the Planner agent calls only the allow-listed MCP tools: create issue (Markdown body, labels), then add to Project, with Status set to Backlog by the app. It has no tool to change status, close, or delete.
   - The adapter verifies the result and records `owner/repo#104`, the issue node ID, and the Project item ID in table `ExternalIssue`.
   - Writes an immutable event to `AuditEvent`.
   - Transitions work item status to `BACKLOGGED`.
   - Auto-navigates to the **Traceable GitHub Project Board** showing the newly created ticket.

