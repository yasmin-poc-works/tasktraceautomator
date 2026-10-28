# UI Design Module 5 — Project Settings & GitHub Integration (GitHub MCP)

This module details how GitHub credentials (a token held by the GitHub MCP server: classic for a personal board, classic or organization-scoped fine-grained for an organization board) are authenticated, verified, and mapped to TaskTraceAutomator projects, as well as team role and permission management.

---

## 5.1 Project Settings & GitHub Integration (`/projects/:id/settings`)

### Purpose
Admin configuration screen for connecting to GitHub Issues and Projects through the GitHub MCP server, testing the connection, mapping the Project `Status` options to our states, and configuring webhook callbacks.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: [Core API ▼]      [Meetings]  [Board]  [Settings]  [Alex (PO)] |
+--------------------------------------------------------------------------------------------------+
|  Project Settings: Core API                                                                      |
|                                                                                                  |
|  [ Tab: 🔌 GitHub ]  [ Tab: 🤖 Claude Code ]  [ Tab: 👥 Team & Permissions ]  [ Tab: ⚙ General ]    |
|                                                                                                  |
|  GitHub Connection (GitHub MCP server)                                                           |
|  Connect TaskTraceAutomator to your GitHub repo Issues and Projects board.                       |
|                                                                                                  |
|  Board owner type:  (•) Personal account   ( ) Organization   (fields change)                    |
|  Owner login: [ yasmin-poc-works ]      Repository: [ core-platform ]                            |
|                                                                                                  |
|  GitHub Project number (Projects v2):                                                            |
|  [ 3                                                                                          ]  |
|                                                                                                  |
|  Token (Personal: classic with `project` + `repo`. Org: classic, or fine-grained for the org):   |
|  [ ******************************************************                                    👁 ] |
|  Tokens are encrypted using AES-256 in the database. [Create a token on GitHub ↗]                |
|                                                                                                  |
|  [ Test GitHub Connection ⚡ ] --> [ MCP reachable ✓  Issues ✓  Projects ✓  Repo access ✓ ]       |
|                                                                                                  |
|  ----------------------------------------------------------------------------------------------  |
|  Repository & Board Mapping:                                                                     |
|                                                                                                  |
|  Target Project board:                                                                           |
|  [ #3 Core Platform Board (acme) ▼ ]                                                             |
|                                                                                                  |
|  Default labels for Work Items:                                                                  |
|  [ backend ✕ ] [ frontend ✕ ] [ bug ✕ ] [ feature ✕ ]  (category labels set by the Planner)      |
|                                                                                                  |
|  Plan changes:                                                                                   |
|  [ Sub-issue ▼ ]  (Created by the Planner agent under the parent issue after approval)           |
|                                                                                                  |
|  Status mapping (our state -> your Project `Status` field option):                               |
|  Backlog [Backlog ▼] TODO [Todo ▼] In Progress [In Progress ▼] QA [QA ▼] Done [Done ▼]           |
|  [ Test mapping ] lists any Status option missing from the Project.                              |
|                                                                                                  |
|  ----------------------------------------------------------------------------------------------  |
|  Inbound GitHub Webhook (Optional for Live Board Sync):                                          |
|                                                                                                  |
|  Webhook Endpoint URL:                                                                           |
|  [ https://api.tasktrace.com/api/integrations/github/webhook/                          ] [Copy 📋] |
|                                                                                                  |
|  Webhook secret (verifies X-Hub-Signature-256):                                                  |
|  [ whsec_984f...c120                                                                 ] [Copy 📋]  |
|                                                                                                  |
|  [ Note: If public webhooks cannot reach your machine, Celery Beat automatically polls GitHub. ] |
|                                                                                                  |
|                                                [ Revert Changes ]        [ Save GitHub Settings ]  |
+--------------------------------------------------------------------------------------------------+
```

---

## 5.1b Claude Code Connection (`/projects/:id/settings`, tab "Claude Code")

### Purpose
Admin configuration for the customer's own Claude Code: the Anthropic API key, the model, and the local backend folder the agent works in.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [ Tab: 🔌 GitHub ]  [ Tab: 🤖 Claude Code ]  [ Tab: 👥 Team & Permissions ]  [ Tab: ⚙ General ]    |
|                                                                                                  |
|  Claude Code Connection                                                                          |
|  TaskTraceAutomator runs YOUR Claude Code with YOUR Anthropic API key. Costs go to your account. |
|                                                                                                  |
|  Anthropic API Key:   [ sk-ant-**********************************                          👁 ]   |
|  Keys are encrypted at rest and never shown again.                                               |
|  Model:               [ claude-sonnet-5-5 ▼ ]                                                    |
|  Per-run budget:      Max turns [ 30 ]   Timeout [ 20 min ]   Cost cap [ $ 5.00 ]                |
|                                                                                                  |
|  Local backend folder:   [ C:\work\core-api                                          ] [Browse]  |
|  Test command:           [ pytest -q                                                    ]        |
|  Lint command:           [ ruff check .                                                 ]        |
|  Protected paths:        [ .env, .github/**, requirements*.txt                          ]        |
|                                                                                                  |
|  [ Test Claude Connection ⚡ ] --> [ CLI found ✓  Key valid ✓  Folder is a clean git repo ✓ ]     |
|                                                                                                  |
|  Note: Each task runs on its own branch (tta/issue-<number>). Nothing is committed or pushed.    |
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
|  Manage who can view discussions, approve requirements, and create GitHub issues.                |
|                                                                                                  |
|  [ Invite Member by Email...                             ]  [ Role: Member (Approver) ▼ ] [Invite]
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | User                  | Role        | Access Level | Permissions              | Action     |  |
|  |-----------------------+-------------+--------------+--------------------------+------------|  |
|  | Sarah Chen            | Member      | APPROVER     | Can transcribe meetings, | [Edit]     |  |
|  | sarah@company.com     |             |              | approve requirements &   |            |  |
|  |                       |             |              | plans, create GitHub issues |         |  |
|  |-----------------------+-------------+--------------+--------------------------+------------|  |
|  | Alex Rivera           | Admin       | FULL ACCESS  | Full admin, settings,    | [Owner]    |  |
|  |                       |             |              | GitHub token, roles      |            |  |
|  |-----------------------+-------------+--------------+--------------------------+------------|  |
|  | External Reviewer     | Non-Member  | VIEWER       | Read-only view of boards | [Remove]   |  |
|  | auditor@client.com    |             |              | and traceability proofs  |            |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  Access Levels Breakdown:                                                                        |
|  • Viewer: Read-only access to meetings, requirements, and board. Cannot approve or create issues|
|  • Approver: Can upload audio, edit/split requirements, sign off plans, and create GitHub issues. |
|  • Full Admin: Complete control over project settings, GitHub tokens, webhooks, and team roles.  |
+--------------------------------------------------------------------------------------------------+
```

