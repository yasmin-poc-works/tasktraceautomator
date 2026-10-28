# TaskTraceAutomator — UI/UX Design System & Information Architecture

This directory contains the complete user interface specifications, wireframes, component layouts, and interaction designs for TaskTraceAutomator.

---

## 1. Design Philosophy: Anti-"Vibe Coding" Traceability

"Vibe coding" relies on unverified conversational prompts that produce un-audited code, loss of meeting decisions, and untraceable bugs. TaskTraceAutomator enforces visual and operational rigor:

1. **Explicit Provenance Over Magic**: Every requirement and Jira ticket must visibly link back to the exact sentence and timestamp in the meeting recording.
2. **Human Approval Gates**: Software intent and implementation plans must be approved by a human before backlog tickets are dispatched or executed.
3. **Dual-Pane Context Co-Location**: Review screens always show source material (transcript/audio) side-by-side with extracted artifacts (requirements/plan).
4. **Deterministic Visual Status**: State machine progression is clearly color-coded, with clear indications of Jira sync status.

---

## 2. Information Architecture & Navigation Map

```mermaid
flowchart TD
    subgraph Public["Public Access (Unauthenticated)"]
        P1["/ (Public Landing Page)"]
        P2["/demo (Interactive Read-Only Showcase)"]
        P3["/trace/:ticket_key (Public Traceability Inspector)"]
        P4["/login & /register"]
    end

    subgraph AuthShell["Authenticated App Shell (/app)"]
        D["/dashboard (Projects & Pending Approvals)"]
        M1["/projects/:id/meetings (Meetings List)"]
        M2["/projects/:id/meetings/new (Upload & Transcribe)"]
        M3["/meetings/:id (Meeting Review & Requirements Gate)"]
        PL1["/work-items/:id/plan (Plan Review & Jira Generator)"]
        B1["/projects/:id/board (Traceable Jira Kanban Board)"]
        T1["/issues/:jira_key (Ticket Detail & Traceability Inspector)"]
        S1["/projects/:id/settings (Jira Integration & Team Roles)"]
    end

    P1 -->|Try Demo| P2
    P1 -->|Verify Ticket| P3
    P1 -->|Sign In| P4
    P4 -->|Login Success| D
    D --> M1
    D --> B1
    M1 --> M2
    M2 --> M3
    M3 -->|Approve Requirements| PL1
    PL1 -->|Approve Plan & Create Jira Ticket| B1
    B1 --> T1
    B1 --> S1
```

---

## 3. Design System & Style Tokens

| Element | Specification | Tailwind Class Equivalent |
|---|---|---|
| **Base Theme** | Clean, modern developer-centric dark/light theme | `bg-slate-900` / `bg-slate-950` text: `text-slate-100` |
| **Surface Cards** | Elevated slate panels with subtle 1px border | `bg-slate-800/80 border border-slate-700/60 rounded-xl` |
| **Brand Accent** | Precision Cyan/Indigo gradient | `from-cyan-400 to-indigo-500` |
| **Jira Accent** | Atlassian Jira Blue | `#0052CC` / `bg-blue-600` |
| **Status: Draft** | Slate / Gray | `bg-slate-700 text-slate-300` |
| **Status: Pending Review** | Amber / Warning | `bg-amber-500/10 text-amber-400 border-amber-500/20` |
| **Status: Approved / Done** | Emerald / Green | `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` |
| **Status: Blocked** | Rose / Red | `bg-rose-500/10 text-rose-400 border-rose-500/20` |
| **Transcript Highlights** | Cyan subtle span highlight with hover pulse | `bg-cyan-500/20 text-cyan-200 border-b-2 border-cyan-400` |

---

## 4. Document Index

The detailed wireframes and component specifications are divided into 5 modules:

1. **[01_public_screens.md](01_public_screens.md)**: Landing page, Interactive Demo, Public Ticket Traceability Inspector, and Authentication.
2. **[02_meeting_and_transcription.md](02_meeting_and_transcription.md)**: Audio dropzone, Live transcription progress, Dual-pane Meeting Review, and Requirements Approval Gate.
3. **[03_plan_and_jira_tickets.md](03_plan_and_jira_tickets.md)**: Technical Implementation Plan Review, Given/When/Then criteria, Scope Allow-list, and Jira Ticket Generator modal.
4. **[04_jira_board_and_ticket_detail.md](04_jira_board_and_ticket_detail.md)**: Traceable Jira Kanban Board, Sub-tasks for plan changes, Ticket Detail with Audio snippet player.
5. **[05_project_settings_and_admin.md](05_project_settings_and_admin.md)**: Jira Cloud OAuth/API Token setup, Project Key mapping, and Role-based team management.

