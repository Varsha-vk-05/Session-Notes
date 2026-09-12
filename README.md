# 📝 Session Notes

A responsive school-based therapy documentation application designed to help clinicians quickly create, review, and submit student session notes.

The application focuses on **fast documentation, reliable autosave, form validation, accessibility, and responsible AI-assisted note generation** while keeping the clinician in control of the final documentation.

---

## 🚀 Live Demo

🔗 **Live Application:**
https://sessionnotes.netlify.app/

---

## 📌 Project Overview

**Session Notes** is a frontend prototype built for school-based therapy providers such as:

* Speech-Language Pathologists
* Occupational Therapists
* Physical Therapists
* School Nurses
* Behavioral Specialists

The application is designed around the reality that clinicians often have only a few minutes between appointments to complete documentation.

The core experience allows a provider to:

1. Select a student and scheduled appointment
2. Create an individual or group session note
3. Enter service and clinical information
4. Use AI to transform factual observations into a professional narrative
5. Automatically save work locally
6. Validate required information
7. Review the completed note
8. Submit and lock the final record
9. Handle unstable-network scenarios through a queued state

---

## ✨ Key Features

### 👩‍⚕️ Session Documentation

* Student-first session selection
* Individual session documentation
* Group session documentation
* Bulk individual note creation
* Same-day multiple-session support
* Withdrawn student handling
* Student absence workflow

### 🤖 AI Note Assist

The application includes a deterministic mock AI service that helps transform provider-entered observations into professional clinical narratives.

**AI safeguards include:**

* Uses only provider-entered observations and selected IEP information
* Does not invent clinical facts
* Does not fabricate percentages, durations, scores, diagnoses, or outcomes
* Detects vague or insufficient input
* Clearly labels AI-generated content
* Requires provider review before applying a generated draft
* AI never automatically submits a note

> **Human-in-the-loop:** The clinician always remains responsible for reviewing and submitting the final documentation.

---

## 💾 Autosave & Persistence

Session drafts are automatically saved to browser `localStorage`.

### Autosave behavior

* Debounced save on input changes
* Draft state survives browser refresh
* Displays the most recent save status
* Maintains a persistent draft ID
* Prevents duplicate records after reload

Example:

```text
Saved just now
Saved 10s ago
```

---

## ✅ Form Validation

Required fields are validated before submission.

Validation includes:

* Service date
* Duration
* Service type
* Modality
* Location
* Activity
* IEP goal
* Objective
* Session narrative

When validation fails, the application:

* Displays a validation summary
* Shows the number of fields requiring attention
* Highlights invalid fields
* Provides navigation to the relevant fields

---

## 👥 Group Sessions

Group sessions support shared session information while maintaining **individual outcomes for each participating student**.

For example:

```text
Group Session
├── Shared Session Information
│   ├── Date
│   ├── Duration
│   ├── Service
│   ├── Modality
│   ├── Location
│   └── Activity
│
├── Maya Reyes
│   └── Individual outcome
│
└── Jordan Tate
    └── Individual outcome
```

All required student outcomes must be completed before the group note can be submitted.

---

## 📚 Bulk Entry

Bulk Entry allows providers to select multiple students and generate **separate individual session drafts**.

> Bulk entry does not create a group session. Each student receives an independent documentation record.

---

## ⚠️ Withdrawn Student Handling

The application identifies withdrawn students and displays a warning before documentation.

The provider can either:

* Continue documenting the session
* Mark the student as absent

When marked absent, the session enters a **Not Billable** state and is recorded as an attendance-only event.

---

## 🔄 Session State Management

The application supports multiple documentation states:

```text
Scheduled
    ↓
Draft
    ↓
Ready to Submit
    ↓
Processing
    ↓
Submitted
```

Additional states include:

```text
Validation Error
Queued
Not Billable
```

### Submitted Notes

Once submitted, notes become:

* Read-only
* Locked from editing
* Associated with an audit history
* Available for review/printing

---

## 📱 Responsive Design

The application follows a mobile-first approach.

### Mobile

* Single-column forms
* Sticky bottom action bar
* Touch-friendly controls
* Bottom sheets for AI assistance
* Minimum 44×44px interactive targets

### Desktop

* Centered responsive layout
* Two-column documentation experience
* Persistent AI assistance panel
* Sticky review summaries

---

## ♿ Accessibility

The application was designed with **WCAG 2.2 AA** principles in mind.

Accessibility features include:

* Semantic HTML
* Explicit form labels
* `aria-describedby`
* `aria-invalid`
* Keyboard navigation
* Escape-key support for dialogs
* Visible focus indicators
* Color-independent status communication
* Touch-friendly controls

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **Tailwind CSS**

### Data & Persistence

* Browser `localStorage`
* Mock seeded datasets
* Client-side state management

### AI

* Deterministic mock AI service
* Rule-based clinical narrative synthesis
* No external API keys required

---

## 📂 Project Structure

```text
Skill/
│
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIAssistPanel.tsx
│   │   │   └── AIReviewCard.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── DraftCard.tsx
│   │   │   ├── SessionCard.tsx
│   │   │   └── StudentCard.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── ValidationSummary.tsx
│   │   │   └── WarningBanner.tsx
│   │   │
│   │   └── layout/
│   │       ├── AppHeader.tsx
│   │       ├── MobileActionBar.tsx
│   │       ├── ProgressStepper.tsx
│   │       └── SaveStatus.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── SessionSelection.tsx
│   │   ├── SessionDocumentation.tsx
│   │   ├── GroupSession.tsx
│   │   ├── BulkEntry.tsx
│   │   ├── ReviewSubmission.tsx
│   │   └── SubmittedNote.tsx
│   │
│   ├── services/
│   │   ├── mockAI.ts
│   │   └── storage.ts
│   │
│   ├── data/
│   │   ├── activities.ts
│   │   ├── sessions.ts
│   │   └── students.ts
│   │
│   ├── types/
│   │   ├── ai.ts
│   │   ├── session.ts
│   │   └── student.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── DESIGN_TOKENS.md
├── ENGINEERING_HANDOFF.md
├── FLOW_MAP.md
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🗺️ Application Routes

| Route            | Screen                   | Purpose                            |
| ---------------- | ------------------------ | ---------------------------------- |
| `/`              | Dashboard                | View drafts and scheduled sessions |
| `/sessions`      | Choose Session           | Select student and appointment     |
| `/sessions/:id`  | Individual Documentation | Create/edit individual note        |
| `/group/:id`     | Group Session            | Document group therapy             |
| `/bulk`          | Bulk Entry               | Create multiple individual drafts  |
| `/review/:id`    | Review & Submit          | Validate and review note           |
| `/submitted/:id` | Submitted Note           | View locked submitted record       |

---

## 🔐 Privacy & Data Approach

This project is currently a **frontend prototype**.

For demonstration purposes:

* Data is stored locally in the browser
* No external clinical database is connected
* No external AI API is required
* No financial or billing amounts are displayed
* Mock data is used for students and sessions

> This prototype should not be considered production-ready for storing real student or clinical information without appropriate security, privacy, authentication, backend infrastructure, and compliance controls.

---

## 🧪 Testing & Verification

The following workflows have been implemented and verified:

* [x] Dashboard and session overview
* [x] Student-first session selection
* [x] Individual documentation
* [x] Group documentation
* [x] Bulk individual entry
* [x] Same-day multiple appointments
* [x] Withdrawn student warning
* [x] Student absent workflow
* [x] AI-assisted note generation
* [x] AI vague-input handling
* [x] Manual editing of AI drafts
* [x] Required-field validation
* [x] Autosave
* [x] Browser refresh persistence
* [x] Review and submission
* [x] Read-only submitted notes
* [x] Queued/offline simulation

---

## 💻 Getting Started

### Prerequisites

Make sure you have:

* Node.js 18+
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate into the project:

```bash
cd Skill
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🤖 AI Architecture

The AI functionality is intentionally implemented as a **mock service** rather than relying on an external LLM API.

```text
Provider Observations
        ↓
AI Note Assist
        ↓
Input Validation
        ↓
Mock AI Service
        ↓
Clinical Narrative Draft
        ↓
Provider Review
        ↓
Edit / Accept / Reject
        ↓
Final Note
```

The provider remains in control at every stage.

The AI-generated narrative is **never automatically submitted**.

---

## 🎯 Design Principles

The project was built around five core principles:

### 1. Speed

Documentation should fit naturally into short gaps between appointments.

### 2. Provider Control

AI should assist clinicians, not make clinical decisions for them.

### 3. Accuracy

The system should never invent clinical information.

### 4. Reliability

Autosave and queued states help prevent loss of documentation.

### 5. Accessibility

The application should remain usable across mobile and desktop devices and for users relying on keyboard and assistive technologies.

---

## 🔮 Future Improvements

Potential next steps include:

* Backend database integration
* Authentication and role-based access
* District SIS integration
* LTI / Ed-Fi integrations
* Secure cloud persistence
* Real LLM integration with appropriate privacy controls
* Speech-to-text dictation
* Real network synchronization
* Automated unit and integration testing
* Comprehensive audit logging
* Production-grade security and compliance infrastructure

---

## 👩‍💻 Author

**Varsha S**

Frontend Developer | React | TypeScript | UI/UX

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.
