# UI Design Module 2 — Meeting Ingestion, Transcription & Review

This module specifies the screens for uploading meeting audio or transcripts, running speech-to-text, reviewing grounded requirements, and passing the human approval gate.

---

## 2.1 Meetings List (`/projects/:id/meetings`)

### Purpose
Provides a paginated list of all recorded discussions, their transcription status, extracted requirement packages, and linked GitHub issue counts.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: [Core API ▼]     [Meetings]  [Board]  [Settings]   [Alex (PO)] |
+--------------------------------------------------------------------------------------------------+
|  Project: Core API / Meetings                                                                    |
|  Review meeting discussions, verify transcriptions, and approve requirements.                    |
|                                                                                                  |
|  [ Search by title, tag, or attendee... ]       [ Status Filter: All ▼ ]     [ + New Meeting ]   |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  | Title & Date             | Source       | Extracted Items | GitHub Issues | Status  | Action|  |
|  |--------------------------+--------------+-----------------+--------------+---------+-------|  |
|  | Sprint 42 Planning       | audio.mp3    | 6 Requirements  | 3 Stories    | APPROVED| [View]|  |
|  | 2026-10-24 10:00 AM      | (18m 42s)    | 2 Open Questions| (#84..86)|         |           |  |
|  |--------------------------+--------------+-----------------+--------------+---------+-------|  |
|  | Billing API Architecture | notes.vtt    | 4 Requirements  | None         | IN REVIEW[Review]  |
|  | 2026-10-26 03:30 PM      | (Transcript) | 1 Open Question | (Pending sign)|         |      |  |
|  |--------------------------+--------------+-----------------+--------------+---------+-------|  |
|  | Weekly Tech Sync         | recording.m4a| Processing...   | —            | TRANSCRIBING    |  |
|  | 2026-10-28 11:00 AM      | (42m 10s)    | 74% complete    |              | [Progress Bar]  |  |
|  +--------------------------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------+
```

---

## 2.2 New Meeting Upload & Transcription (`/projects/:id/meetings/new`)

### Purpose
Allows authorized members to upload transcript files (`.txt`, `.md`, `.vtt`, `.srt`) or type a request directly (with an item type of new feature, bug, or enhancement), with automatic secret/PII redaction and content moderation. The audio recording tab shown in the wireframe is good-to-have (G2); the primary path is live "Take notes" (section 2.4). YouTube URL (G12) is a later addition.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: Core API / Meetings / New Upload                           |
+--------------------------------------------------------------------------------------------------+
|  <- Back to Meetings                                                                             |
|                                                                                                  |
|  Upload Discussion Source                                                                        |
|  Choose how you want to ingest the meeting decisions:                                            |
|                                                                                                  |
|  [ Tab: 🎙 Audio Recording ]          [ Tab: 📄 Text / VTT Transcript ]                            |
|                                                                                                  |
|  +--------------------------------------------------------------------------------------------+  |
|  |                                                                                            |  |
|  |                       [ Upload Icon: Cloud with Arrow ]                                    |  |
|  |                       Drag and drop your audio file here                                   |  |
|  |                       Supports .mp3, .wav, .m4a (up to 200MB)                              |  |
|  |                                                                                            |  |
|  |                                 [ Browse Files ]                                           |  |
|  |                                                                                            |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  Transcription & Analysis Options:                                                               |
|  Meeting Title:        [ Sprint 43 Architecture Alignment                           ]            |
|  Primary Language:     [ English (US) ▼ ]                                                        |
|  Transcription Engine: [ faster-whisper (Local CPU - Zero Cost) ▼ ]                              |
|  PII / Secret Redact:  [✓] Automatically redact detected API keys, passwords, and phone numbers  |
|                                                                                                  |
|                                     [ Cancel ]     [ Start Transcription & Analysis ]            |
|                                                                                                  |
|  ----------------------------------------------------------------------------------------------  |
|  (When Transcription is Active):                                                                 |
|  [=========================================>               ] 68% Transcribing audio...           |
|  Step 1: Normalizing audio  ✓                                                                    |
|  Step 2: Faster-Whisper Speech-to-Text (Est: 45s remaining) ...                                  |
|  Step 3: Meeting Analyst extracting decisions & requirements (Pending)                           |
+--------------------------------------------------------------------------------------------------+
```

---

## 2.4 "Take notes" Live Capture (primary path)

### Purpose
Like Zoom or Granola: when a logged-in user is in a meeting, the app offers to take notes. The browser captures the user's mic plus tab/system audio, so it also works for a video playing on the user's system. Video file upload is not supported.

### ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Project: Core API                          [Alex (PO)]              |
+--------------------------------------------------------------------------------------------------+
|  Prompt (shown when a meeting is detected):                                                      |
|  +--------------------------------------------------------------------------------------------+  |
|  |  You seem to be in a meeting. Take notes?                                                  |  |
|  |  This records your mic and the shared tab/system audio. Tell other participants.           |  |
|  |  Project: [ Core API ▼ ]                       [ Not now ]     [ Take notes ]              |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  While recording:                                                                                |
|  [● REC 12:41]  Live transcript (last lines)...          [ Pause ]   [ Stop & Analyse ]          |
|                                                                                                  |
|  On stop: moderation + redaction -> Meeting Analyst -> review page (section 2.3)                 |
+--------------------------------------------------------------------------------------------------+
```

### Rules
- Recording starts only after the user clicks `[Take notes]` and grants the browser's capture permission.
- A visible recording indicator stays on screen until the user stops.
- If moderation rejects the content, the user sees the reason and nothing is analysed.
- Only coding work becomes action items; other items are listed as out of scope.
- A manual `[Take notes]` button is also available on the Meetings list, since detection can miss.

---

## 2.3 Meeting Review & Traceable Requirements Gate (`/meetings/:id`)

### Purpose
The pivotal anti-vibe-coding gate. The Product Owner or Tech Lead inspects the meeting transcript side-by-side with the AI-extracted requirements, verifies each citation against the spoken audio, resolves open questions, and formally signs off.

### ASCII Wireframe: Dual-Pane Co-Location Layout
```text
+--------------------------------------------------------------------------------------------------+
|  [Logo] TaskTraceAutomator   Sprint 43 Architecture Alignment   [Status: PENDING APPROVAL]       |
+--------------------------------------------------------------------------------------------------+
|  [ ◀ Back ]  Meeting Date: 2026-10-28  |  Duration: 18m 42s  |  Author: Sarah (PO)               |
|                                                     [ + Add Requirement ]  [ APPROVE PACKAGE ✔ ] |
+-------------------------------------------------+------------------------------------------------+
|  LEFT PANE: Timestamped Transcript & Audio Play |  RIGHT PANE: Extracted Requirements & Questions|
+-------------------------------------------------+------------------------------------------------+
|  [▶ Play] 04:12 / 18:42  [======|==============] |  [ Filter: All (6) | Decisions (2) | Reqs (4) ]|
|  Audio Waveform: |||||||||||||||||||||||||||||| |                                                |
|                                                 |  +------------------------------------------+  |
|  [03:50] Mark (Engineer):                       |  | DECISION #1                   [Confidence 98%]
|  "Which tracker: GitHub Issues or Linear?"           |  | Target Issue Tracker is GitHub.        |  |
|                                                 |  | Spoken at: 04:12 by Sarah [Listen ▶]     |  |
|  [04:12] Sarah (Product Owner):                 |  | Linked Span: [04:12 - 04:30]             |  |
|  >>> HIGHLIGHTED CYAN SPAN <<<                  |  +------------------------------------------+  |
|  "We are definitely using GitHub for this                                                        |
|  sprint. We need automated ticket creation with |  +------------------------------------------+  |
|  all acceptance criteria so engineers don't     |  | FUNCTIONAL REQUIREMENT #1     [Confidence 94%]
|  have to guess what we agreed."                 |  | Automated GitHub Issue Creation:         |  |
|  >>> END SPAN <<<                               |  | System must call GitHub MCP tools to     |  |
|                                                 |  | create issues directly in the project    |  |
|  [04:45] Mark:                                  |  | backlog with Markdown descriptions.      |  |
|  "What about changes to the approved plan?"     |  |                                          |  |
|                                                 |  | Origin: Spoken by Sarah [04:12]          |  |
|  [05:02] Sarah:                                 |  | Acceptance Criteria Preview:             |  |
|  >>> HIGHLIGHTED PURPLE SPAN <<<                |  | • Given approved plan, When user clicks  |  |
|  "If the plan changes, create a sub-issue under  |  |   'Create GitHub Issue', Then create issue|  |
|  the parent ticket. Never silently edit the     |  |                                          |  |
|  original ticket."                              |  | [Edit ✎]  [Split ⑂]  [Delete 🗑]          |  |
|  >>> END SPAN <<<                               |  +------------------------------------------+  |
|                                                 |                                                |
|  [05:40] Dave (Security):                       |  +------------------------------------------+  |
|  "API tokens should be encrypted in DB."        |  | ❓ OPEN QUESTION (Must resolve to approve)|  |
|                                                 |  | Question: Which labels? backend or feature||  |
|                                                 |  | Task?                                    |  |
|                                                 |  | [ Enter answer / Decision...           ] |  |
|                                                 |  | [ Resolve Question ✔ ]                   |  |
|                                                 |  +------------------------------------------+  |
+-------------------------------------------------+------------------------------------------------+
```

### Critical Component Interactions
1. **Interactive Provenance Highlighting**:
   - Clicking on `[Listen ▶]` next to any requirement scrubs the audio player to that exact timestamp and highlights the speech segment in the left pane.
   - Selecting any text in the transcript opens a floating popover: `[+ Convert Selection into Requirement]`.
2. **Review Actions**:
   - **Edit**: Allows fine-tuning requirement title, description, and confidence.
   - **Split**: Splits a broad requirement into two focused, independently testable requirements.
   - **Resolve Questions**: Unresolved blocking questions disable the `[APPROVE PACKAGE]` button until answered.
3. **Approval State Transition**:
   - Clicking `[APPROVE PACKAGE ✔]` opens a confirmation dialog showing the generated SHA-256 hash.
   - Marks the package as `REQUIREMENTS_APPROVED` and transitions directly to Implementation Planning.

