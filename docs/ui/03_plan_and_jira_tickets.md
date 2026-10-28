# UI Design Module 3 — Technical Planning & Jira Ticket Generation

This module details how approved requirements are converted into technical implementation plans, how file scope is strictly bounded, and how traceable Jira tickets are generated.

---

## 3.1 Technical Implementation Plan Review (`/work-items/:id/plan`)

### Purpose
Before any Jira ticket is created or any code is modified, the Engineering Lead reviews the Planner Agent's breakdown. This includes Given/When/Then acceptance criteria, Definition of Done, allowed files, and test commands.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Work Item #42: Automated Jira Ticket Creation    [Plan Version: v1.0]
+--------------------------------------------------------------------------------------------------+
|  <- Back to Meeting Requirements                                                                 |
|  Linked Meeting: Sprint 43 Architecture Alignment (Spoken by Sarah at 04:12)                     |
|                                                                                                  |
|  Summary: Call Jira Cloud REST API v3 to create backlog issues from approved plans               |
|                                                                                                  |
|  [ Section 1: Acceptance Criteria (Given / When / Then) ]                                        |
|  +--------------------------------------------------------------------------------------------+  |
|  | AC 1: Successful Ticket Creation                                                          |  |
|  | Given an approved ImplementationPlan v1.0,                                                 |  |
|  | When the user triggers "Create Jira Ticket",                                              |  |
|  | Then POST to https://{domain}.atlassian.net/rest/api/3/issue with ADF formatted body       |  |
|  | And store the returned Jira Key (e.g., PROJ-104) and node ID in ExternalIssue.             |  |
|  |                                                                                            |  |
|  | AC 2: Idempotent Dispatch                                                                  |  |
|  | Given an existing ExternalIssue for plan version v1.0,                                     |  |
|  | When a retry or duplicate request occurs,                                                  |  |
|  | Then return the existing ticket reference without creating a duplicate in Jira.            |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  [ Section 2: Definition of Done (DoD) Checklist ]                                               |
|  [x] Unit tests for JiraAdapter using recorded HTTP fixtures (pytest)                            |
|  [x] Encrypted storage for Jira API Token in Project settings                                    |
|  [x] Jira Atlassian Document Format (ADF) description builder implemented                        |
|  [x] Append-only audit log entry recorded on ticket creation                                     |
|                                                                                                  |
|  [ Section 3: Bounded Scope & Path Policy (Anti-Vibe-Coding Guard) ]                              |
|  The AI Coding Agent will ONLY be allowed to touch these files. All other files are protected:   |
|  +--------------------------------------------------------------------------------------------+  |
|  | Allowed Files to Modify / Create:                      | Protected Paths (Strict Block):   |  |
|  | • api/providers/tracker/jira.py                       | • api/config/settings.py          |  |
|  | • api/apps/integrations/models.py                     | • api/apps/audit/*                |  |
|  | • api/tests/unit/test_jira_adapter.py                 | • docker-compose.yml              |  |
|  +--------------------------------------------------------------------------------------------+  |
|  Execution Budget: Max turns: 8 | Wall timeout: 10 mins | Max diff size: 250 lines               |
|                                                                                                  |
|                                [ Edit Plan Scope ]    [ APPROVE PLAN & CREATE JIRA TICKET 🚀 ]   |
+--------------------------------------------------------------------------------------------------+
```

---

## 3.2 Jira Ticket Creation Preview Modal

### Purpose
Appears when the engineer clicks "APPROVE PLAN & CREATE JIRA TICKET". Allows reviewing the exact Jira ticket format before it is dispatched to Atlassian Cloud.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|                                    Confirm & Create Jira Ticket                                  |
+--------------------------------------------------------------------------------------------------+
|  TaskTraceAutomator will generate an official backlog ticket in your Jira Cloud instance:        |
|                                                                                                  |
|  Target Jira Instance:  [ https://tasktrace.atlassian.net (Connected ✓) ]                        |
|  Target Project:        [ CORE - Core Platform API (CORE) ▼ ]                                    |
|  Issue Type:            [ Story ▼ ]           Priority: [ High ▼ ]                               |
|                                                                                                  |
|  PREVIEW OF TICKET IN JIRA:                                                                      |
|  +--------------------------------------------------------------------------------------------+  |
|  | Summary: Call Jira Cloud REST API v3 to create backlog issues from approved plans         |  |
|  |                                                                                            |  |
|  | Description:                                                                               |  |
|  | 🎙 Meeting Provenance:                                                                     |  |
|  | Spoken by Sarah (Product Owner) during "Sprint 43 Architecture Alignment" (04:12)          |  |
|  | Quote: "We are definitely using Jira Cloud for this sprint. We need automated ticket       |  |
|  | creation with all acceptance criteria so engineers don't have to guess..."                 |  |
|  | Verified Audio Link: http://tasktrace.local/trace/req-42 [Listen ▶]                        |  |
|  |                                                                                            |  |
|  | 📋 Acceptance Criteria:                                                                    |  |
|  | • Given approved ImplementationPlan v1.0, When triggered, Then POST to Jira API.           |  |
|  | • Given existing ExternalIssue, When retried, Then return existing key without duplicating.|  |
|  |                                                                                            |  |
|  | 🏁 Definition of Done:                                                                     |  |
|  | • Unit tests with mocked fixtures passing.                                                 |  |
|  | • Scoped strictly to api/providers/tracker/jira.py.                                        |  |
|  |                                                                                            |  |
|  | 🔒 Traceability Metadata:                                                                  |  |
|  | WorkItem ID: wi-849204 | Plan SHA: 7b84...e21a | TaskTraceAutomator v0.1.0                 |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|                                [ Cancel ]      [ Confirm & Publish to Jira Backlog ↗ ]           |
+--------------------------------------------------------------------------------------------------+
```

### Components & State Machine
1. **Atlassian REST API Dispatch**:
   - Sends `POST /rest/api/3/issue` with headers `Authorization: Basic {base64(email:token)}`.
   - On success (HTTP 201), records Jira key `CORE-104` in database table `ExternalIssue`.
   - Writes an immutable event to `AuditEvent`.
   - Transitions work item status to `BACKLOGGED`.
   - Auto-navigates to the **Traceable Kanban Board** showing the newly created ticket.

