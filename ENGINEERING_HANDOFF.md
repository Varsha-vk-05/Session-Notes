# Engineering Handoff Document — Session Notes

## 1. Product Overview
**Session Notes** is a specialized school-based therapy documentation product designed for clinicians (Speech-Language Pathologists, Occupational Therapists, Physical Therapists, School Nurses, and Behavioral Specialists) to document student services between appointments on mobile and desktop devices.

## 2. Primary User
- **Name**: Jamie Chen, CCC-SLP
- **Work Setting**: Lincoln Elementary School
- **Key Characteristics**: Highly mobile, documents on phone between 30-minute student blocks, constrained by 5–10 minute gaps, strictly audited for IEP compliance.

## 3. Screen Map & Routes
| Route | Screen Name | Key Purpose |
|---|---|---|
| `/` | **Dashboard** | Overview of drafts, today's schedule, recently submitted notes |
| `/sessions` | **Choose Session** | Student-first session selection with modality filters |
| `/sessions/:id` | **Individual Documentation** | Primary 1:1 documentation experience with autosave & AI |
| `/group/:id` | **Group Session** | Shared group metadata with student-specific outcomes |
| `/bulk` | **Bulk Individual Entry** | Batch generation of independent individual notes |
| `/review/:id` | **Review & Submit** | Summary verification before submission |
| `/submitted/:id` | **Submitted Read-Only Note** | Compliance-locked record with audit history |

## 4. User Flow Summary
1. **Landing**: Provider logs on at 2:10 PM, sees 3 pending sessions.
2. **Choose Session**: Provider selects student first (e.g. Maya Reyes), then picks specific scheduled appointment (1:10 PM group vs 1:45 PM individual make-up).
3. **Document**: Provider enters service details (Date, Duration, Service, Modality, Location, Activity, IEP Goal/Objective, Note).
4. **AI Note Assist**: Provider types quick observations, requests AI draft, reviews/edits, and inserts into note.
5. **Autosave**: Continuous debounced localStorage updates preserve work.
6. **Review & Submit**: Validates all fields, shows confirmation, locks note into read-only state.

## 5. Component Inventory
- **Atomic Controls**: `Button`, `Input`, `Select`, `Textarea`, `DateField`, `DurationField`, `StatusBadge`
- **Feedback & Alerts**: `WarningBanner`, `ValidationSummary`, `SaveStatus`, `EmptyState`
- **Layout & Navigation**: `AppHeader`, `ProgressStepper`, `MobileActionBar`
- **Cards**: `SessionCard`, `DraftCard`, `StudentCard`
- **AI Assist Components**: `AIAssistPanel`, `AIReviewCard`
- **Dialogs & Sheets**: `Modal`, `BottomSheet`, `ConfirmDialog`

## 6. Design Tokens
- **Color Palette**: Deep Navy (`#0F1A2C`), Medical Teal (`#0D9488`), Slate Neutrals (`#F8FAFC` to `#0F172A`), Status Amber (`#D97706`), Emerald (`#16A34A`), Red (`#DC2626`).
- **Typography**: Inter font family; sizes from `10px` (meta/tags) to `24px`/`30px` (headings).
- **Touch Target**: Minimum 44×44px for buttons and touch elements.

## 7. Responsive Behavior
- **Mobile (<768px)**: Sticky bottom action bar, bottom-sheet overlays, single-column forms, tap-friendly presets.
- **Desktop (>=1024px)**: 2-column layout with persistent AI Assist panel on the right and sticky review summaries.

## 8. Accessibility Behavior (WCAG 2.2 AA)
- Semantic HTML tags (`<nav>`, `<main>`, `<dialog>`).
- Explicit form `<label>` associations and `aria-describedby` links for errors.
- High-visibility focus indicators (`ring-2 ring-teal-600 ring-offset-2`).
- Color-independent state communication (text + icon + color).

## 9. Form Fields
1. **Service Date** (Required, ISO Date string)
2. **Duration** (Required, integer > 0 minutes)
3. **Service Type** (Required, Configured Enum: Speech, OT, PT, Nursing, Behavioral)
4. **Modality** (Required, Enum: Individual, Group, Telehealth)
5. **Location** (Required, Enum: Room 204, Classroom, Therapy room, Sensory room, Virtual, Other)
6. **Activity** (Required, Dropdown or custom string)
7. **IEP Goal** (Required, Linked to student IEP profile)
8. **Objective** (Required, Linked to selected IEP goal)
9. **Session Note Narrative** (Required, Clinical text description)

## 10. Validation Rules
- `Service Date`: Must be a valid date.
- `Duration`: Must be a positive number (> 0).
- `Service Type`, `Modality`, `Location`, `Activity`: Must be selected.
- `IEP Goal` & `Objective`: Must be linked.
- `Narrative Note`: Cannot be empty or whitespace only.
- Validation failures produce an alert banner with count ("X items need attention") and jump-to-field links.

## 11. Session State Model
```
scheduled → draft → ready_to_submit → processing → submitted
                  ↘ validation_error              ↘ queued (if offline)
                  ↘ not_billable (if absent/withdrawn)
```

## 12. Draft / Save Behavior
- Autosaves locally on input change (debounced at 350ms).
- Records `lastSavedTimestamp` and renders live human-readable text ("Saved just now", "Saved 10s ago").
- Maintains draft ID so reloading does not create duplicate entries.

## 13. Submission States
1. **Draft**: In-progress document, editable.
2. **Ready to Submit**: Validation passed.
3. **Validation Error**: Missing required clinical data.
4. **Processing**: Active network/storage transition.
5. **Submitted**: Finalized, locked, read-only with audit log.
6. **Queued**: Saved locally under unstable connection; auto-processes upon reconnect.
7. **Not Billable**: Documented missed/absent session without billing implications.

## 14. AI Inputs
- Student Name & Grade
- Linked IEP Goal & Objective
- Activity & Modality
- Provider Factual Observations

## 15. AI Outputs
- Structured, professional clinical narrative adhering strictly to provider observations.
- Confidence score and token metadata.

## 16. AI Guardrails
- Refuses to draft if input is vague (e.g. "worked on stories").
- Never invents percentages, trials, durations, or diagnostic terms not provided by user.
- Explicitly flags text as "AI-generated draft — review before using".

## 17. AI Fallback Behavior
- If AI generation fails or input is insufficient, the system provides a clear "More information needed" alert and keeps manual textarea fully editable.

## 18. Group Session Rules
- Shared metadata (Date, Duration, Service, Modality=Group, Location, Activity).
- Separate clinical outcomes for each participating student (Maya Reyes & Jordan Tate).
- Requires all student outcomes to be completed before group note submission.

## 19. Bulk Entry Rules
- Generates **independent individual session drafts** for multiple selected students.
- Explicitly warns provider that notes will be separate and NOT a group session.

## 20. Same-Day Session Rules
- When a student has multiple appointments in one day (e.g. Maya Reyes at 1:10 PM and 1:45 PM), the system enforces separate IDs, separate notes, and separate draft states.

## 21. Withdrawn Student Rules
- Displays prominent warning when opening withdrawn students (e.g. Eli Morgan).
- Does not block documentation; provides explicit `[Student absent]` action which records a `Not billable` session.

## 22. Privacy & Data Assumptions
- Strict HIPAA / FERPA compliance posture: All data stored locally on device.
- Absolute prohibition against displaying dollar amounts, rates, or payment claims.

## 23. Acceptance Criteria
- [x] All 7 session states reachable and demonstrable.
- [x] Mobile and desktop layouts responsive and touch-friendly.
- [x] LocalStorage persistence survives browser reloads.
- [x] Mock AI responds deterministically within 700–1200ms.

## 24. Open Questions for Future Iterations
- Integration with district SIS (Student Information System) via LTI / Ed-Fi standards.
- Speech-to-text audio dictation integration for mobile on-the-go observations.

## 25. Known Limitations
- Local prototype only; clearing browser storage resets data to initial seed state.
- Deterministic rule-based LLM simulation in `mockAI.ts` replaces live external API calls.
