# Flow Map — Session Notes Application

This document maps the user flows, decision branching, and screen transitions within the Session Notes prototype.

---

## 1. Master Application Flow Map

```
                     ┌────────────────────────────────┐
                     │          Dashboard             │  Route: /
                     │   "Good afternoon, Jamie"      │
                     │  - In-progress Drafts          │
                     │  - Today's Sessions            │
                     │  - Recently Recorded Notes     │
                     └───────────────┬────────────────┘
                                     │
                        [Start a session note]
                                     │
                                     ▼
                     ┌────────────────────────────────┐
                     │        Choose Session          │  Route: /sessions
                     │  - Step 1: Select Student      │
                     │  - Step 2: Select Appointment  │
                     └───────────────┬────────────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             │ (Individual Mode)     │ (Group Mode)          │ (Bulk Entry Mode)
             ▼                       ▼                       ▼
┌─────────────────────────┐ ┌──────────────────────┐ ┌─────────────────────────┐
│  Individual Session     │ │  Group Session       │ │  Bulk Individual Entry  │
│  Route: /sessions/:id   │ │  Route: /group/:id   │ │  Route: /bulk           │
│  - Service Date/Time    │ │  - Shared Metadata   │ │  - Select N students    │
│  - Service Type         │ │  - Student Outcome   │ │  - Set shared defaults  │
│  - Modality / Location  │ │    Tabs (Maya &      │ │  - Generates N separate │
│  - Activity & IEP Goal  │ │    Jordan)           │ │    individual records   │
│  - AI Note Assist       │ │  - AI per student    │ └────────────┬────────────┘
│  - Narrative Textarea   │ │  - Individual Goals  │              │
└────────────┬────────────┘ └──────────┬───────────┘              │
             │                         │                          │
             │ [Autosaves locally]     │ [Autosaves locally]      │ [Creates drafts]
             │                         │                          │
             └────────────┬────────────┘                          ▼
                          │                                  (Dashboard)
                          ▼
             ┌─────────────────────────┐
             │   Form Validation       │
             │   - Date & Duration > 0 │
             │   - Activity selected   │
             │   - IEP Goal/Obj linked │
             │   - Narrative completed │
             └────────────┬────────────┘
                          │ (Passes)
                          ▼
             ┌─────────────────────────┐
             │    Review & Submit      │  Route: /review/:id
             │  - Compact summary card │
             │  - Attestation sign-off │
             └────────────┬────────────┘
                          │
                          │ [Submit Note]
                          ▼
             ┌─────────────────────────┐
             │   Submit Processing     │  (Simulated latency)
             └────────────┬────────────┘
                          │
             ┌────────────┴─────────────────────────┐
             │ (Normal Conn.)                       │ (Unstable Conn.)
             ▼                                      ▼
┌─────────────────────────┐            ┌─────────────────────────┐
│     Note Submitted      │            │    Saved and Queued     │
│   Status: 'submitted'   │            │    Status: 'queued'     │
│   - Read-only locked    │            │    - Read-only locked   │
│   - Audit history log   │            │    - Auto-transmits     │
│   - Print record        │            │    - Audit history log  │
│   Route: /submitted/:id │            │   Route: /submitted/:id │
└─────────────────────────┘            └─────────────────────────┘
```

---

## 2. Specialized Scenario Flows

### A. Same-Day Second Service Flow (Maya Reyes)
Maya Reyes is scheduled for two distinct appointments on the same day:
1. **1:10 PM – 1:40 PM**: Group speech therapy session in Room 204.
2. **1:45 PM – 2:00 PM**: Individual make-up session in Room 204.

```
Choose Session (Maya Reyes selected)
   ├── Appointment 1: 1:10 PM Group Speech (ID: session-group-1) ────────► Group Session Flow (/group/session-group-1)
   └── Appointment 2: 1:45 PM Make-up Activity (ID: session-maya-makeup-2) ─► Individual Documentation (/sessions/session-maya-makeup-2)
```
*Guaranteed Rule: The application maintains distinct IDs, distinct draft records, and independent narrative notes.*

---

### B. Withdrawn Student Flow (Eli Morgan)
Eli Morgan was withdrawn on August 13, 2026. An old scheduled appointment remains on the calendar for 2:05 PM.

```
Open Eli Morgan Session (/sessions/session-eli-withdrawn-3)
   │
   ▼
[Withdrawn Warning Banner displayed]
   │
   ├─► Action 1: [Record Session] ──────► Proceed with standard individual documentation
   │
   └─► Action 2: [Student Absent]
             │
             ▼
       [Confirmation Dialog]
             │
             ▼
       [Set Status: 'not_billable']
       [Set Reason: 'Student absent']
       [Document Attendance Only — No Claims/Billing]
             │
             ▼
       Navigate to /submitted/session-eli-withdrawn-3 (Read-only confirmation)
```

---

### C. AI Note Assist Workflow

```
[Provider enters raw observations]
   │
   ▼
[Click "Draft note with AI"]
   │
   ▼
[Mock LLM Service Analyzes Input]
   │
   ├─► Input is Vague (<12 chars or uninformative phrase)
   │         │
   │         ▼
   │   [Guardrail: "More information needed" alert]
   │   [Prompts provider for specific activity and level of prompting]
   │
   └─► Input is Factual & Sufficient
             │
             ▼
       [AI Review Card Rendered]
       - Marked "AI-generated draft — review before using"
       - Guardrail badge: "No unverified clinical facts"
             │
             ├── [Use draft]   ──► Populates editable textarea (Does NOT auto-submit)
             ├── [Edit]        ──► Allows inline tweaking prior to applying
             ├── [Regenerate]  ──► Re-synthesizes narrative
             └── [Reject]      ──► Discards AI draft
```
