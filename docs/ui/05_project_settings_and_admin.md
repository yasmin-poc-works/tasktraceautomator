# UI Design Module 5 — Project Settings & Jira Cloud Integration

This module details how Jira Cloud credentials are authenticated, verified, and mapped to TaskTraceAutomator projects, as well as team role and permission management.

---

## 5.1 Project Settings & Jira Cloud Integration (`/projects/:id/settings`)

### Purpose
Admin configuration screen for connecting to Jira Cloud via REST API v3, testing the connection, mapping default issue types, and configuring webhook callbacks.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: [Core API ▼]      [Meetings]  [Board]  [Settings]  [Alex (PO)] |
+--------------------------------------------------------------------------------------------------+
|  Project Settings: Core API                                                                      |
|                                                                                                  |
|  [ Tab: 🔌 Jira ]  [ Tab: 🤖 Claude Code ]  [ Tab: 👥 Team & Permissions ]  [ Tab: ⚙ General ]   |
|                                                                                                  |
|  Jira Cloud Connection (REST API v3)                                                             |
|  Connect TaskTraceAutomator to your Atlassian Jira workspace to sync tickets and sub-tasks.      |
|                                                                                                  |
|  Jira Cloud Domain:                                                                              |
|  [ https://tasktrace.atlassian.net                                                             ] |
|                                                                                                  |
|  Jira Account Email:                                                                             |
|  [ integrations@company.com                                                                    ] |
|                                                                                                  |
|  Jira API Token:                                                                                 |
|  [ ******************************************************                                    👁 ] |
|  Tokens are encrypted using AES-256 in the database. [Create API Token in Atlassian Console ↗]   |
|                                                                                                  |
|  [ Test Jira Connection ⚡ ]  -->  [ Status: Connected to "TaskTrace Org" (Latency: 140ms) ✓ ]  |
|                                                                                                  |
|  ----------------------------------------------------------------------------------------------  |
|  Project & Issue Mapping:                                                                        |
|                                                                                                  |
|  Target Jira Project:                                                                            |
|  [ CORE - Core Platform Services (Key: CORE) ▼ ]                                                 |
|                                                                                                  |
|  Default Issue Type for Work Items:                                                              |
|  [ Story ▼ ]  (Options: Story, Task, Improvement)                                                |
|                                                                                                  |
|  Default Issue Type for Plan Changes:                                                            |
|  [ Sub-task ▼ ]  (Automatically created under parent ticket)                                    |
|                                                                                                  |
|  Status mapping (our state -> your Jira workflow status):                                        |
|  Backlog [Backlog ▼]  TODO [To Do ▼]  In Progress [In Progress ▼]  QA [QA ▼]  Done [Done ▼]    |
|  [ Test mapping ] lists any status missing from the project's workflow.                          |
|                                                                                                  |
|  ----------------------------------------------------------------------------------------------  |
|  Inbound Jira Webhook (Optional for Live Board Sync):                                            |
|                                                                                                  |
|  Webhook Endpoint URL:                                                                           |
|  [ https://api.tasktrace.com/api/integrations/jira/webhook/                          ] [Copy 📋] |
|                                                                                                  |
|  Webhook HMAC Secret:                                                                            |
|  [ whsec_984f...c120                                                                 ] [Copy 📋] |
|                                                                                                  |
|  [ Note: If public webhooks cannot reach your machine, Celery Beat automatically polls Jira. ]   |
|                                                                                                  |
|                                                [ Revert Changes ]        [ Save Jira Settings ]  |
+--------------------------------------------------------------------------------------------------+
```

---

## 5.1b Claude Code Connection (`/projects/:id/settings`, tab "Claude Code")

### Purpose
Admin configuration for the customer's own Claude Code: the Anthropic API key, the model, and the local backend folder the agent works in.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [ Tab: 🔌 Jira ]  [ Tab: 🤖 Claude Code ]  [ Tab: 👥 Team & Permissions ]  [ Tab: ⚙ General ]   |
|                                                                                                  |
|  Claude Code Connection                                                                          |
|  TaskTraceAutomator runs YOUR Claude Code with YOUR Anthropic API key. Costs go to your account. |
|                                                                                                  |
|  Anthropic API Key:   [ sk-ant-**********************************                          👁 ] |
|  Keys are encrypted at rest and never shown again.                                               |
|  Model:               [ claude-sonnet-5-5 ▼ ]                                                    |
|  Per-run budget:      Max turns [ 30 ]   Timeout [ 20 min ]   Cost cap [ $ 5.00 ]               |
|                                                                                                  |
|  Local backend folder:   [ C:\work\core-api                                          ] [Browse] |
|  Test command:           [ pytest -q                                                    ]        |
|  Lint command:           [ ruff check .                                                 ]        |
|  Protected paths:        [ .env, .github/**, requirements*.txt                          ]        |
|                                                                                                  |
|  [ Test Claude Connection ⚡ ] --> [ CLI found ✓  Key valid ✓  Folder is a clean git repo ✓ ]    |
|                                                                                                  |
|  Note: Each task runs on its own branch (tta/<ticket-key>). Nothing is committed or pushed.      |
|        You review the branch and commit, push, and open PRs yourself.                            |
|                                                                                                  |
|                                              [ Revert Changes ]      [ Save Claude Settings ]    |
+--------------------------------------------------------------------------------------------------+
```

---

## 5.2 Team Roles & Access Control (`/projects/:id/members`)

### Purpose
Allows Project Admins to assign users to project roles and access levels (Viewer, Approver, Full Admin).

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  Project Settings: Core API / Team & Permissions                                                 |
+--------------------------------------------------------------------------------------------------+
|  Manage who can view discussions, approve requirements, and create Jira tickets.                 |
|                                                                                                  |
|  [ Invite Member by Email...                             ]  [ Role: Member (Approver) ▼ ] [Invite]
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | User                  | Role        | Access Level | Permissions              | Action     |  |
|  |-----------------------+-------------+--------------+--------------------------+------------|  |
|  | Sarah Chen            | Member      | APPROVER     | Can transcribe meetings, | [Edit]     |  |
|  | sarah@company.com     |             |              | approve requirements &   |            |  |
|  |                       |             |              | plans, push to Jira      |            |  |
|  |-----------------------+-------------+--------------+--------------------------+------------|  |
|  | Alex Rivera           | Admin       | FULL ACCESS  | Full admin, settings,    | [Owner]    |  |
|  | alex@company.com      |             |              | Jira credentials, roles  |            |  |
|  |-----------------------+-------------+--------------+--------------------------+------------|  |
|  | External Reviewer     | Non-Member  | VIEWER       | Read-only view of boards | [Remove]   |  |
|  | auditor@client.com    |             |              | and traceability proofs  |            |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  Access Levels Breakdown:                                                                        |
|  • Viewer: Read-only access to meetings, requirements, and board. Cannot approve or push tickets.|
|  • Approver: Can upload audio, edit/split requirements, sign off plans, and create Jira tickets. |
|  • Full Admin: Complete control over project settings, Jira tokens, webhooks, and team roles.   |
+--------------------------------------------------------------------------------------------------+
```

