# Design Tokens — Session Notes

This document specifies the design tokens, visual hierarchy, components, and styling conventions used across the Session Notes healthcare/education documentation system.

---

## 1. Color Palette

### Brand & Neutrals
| Token Name | Hex Code | Tailwind Class | Primary Usage |
|---|---|---|---|
| **Navy 950** | `#082542` | `bg-navy-950` | Primary app hero, dark surfaces |
| **Navy 900** | `#0F1A2C` | `bg-navy-900` | Primary buttons, headers, active tabs |
| **Navy 800** | `#1D2A43` | `bg-navy-800` | Button hover states |
| **Slate 900** | `#0F172A` | `text-slate-900` | Primary headings and high-contrast text |
| **Slate 800** | `#1E293B` | `text-slate-800` | Form labels, card titles |
| **Slate 500** | `#64748B` | `text-slate-500` | Secondary text, helper notes |
| **Slate 200** | `#E2E8F0` | `border-slate-200`| Component card borders |
| **Slate 50** | `#F8FAFC` | `bg-slate-50` | Main application background |

### Healthcare Accents (Teal)
| Token Name | Hex Code | Tailwind Class | Primary Usage |
|---|---|---|---|
| **Teal 700** | `#0F766E` | `bg-teal-700` | Secondary buttons, primary accents |
| **Teal 600** | `#0D9488` | `text-teal-600` | Focus outlines, active icons |
| **Teal 100** | `#CCFBF1` | `bg-teal-100` | Badges, avatar highlights |
| **Teal 50** | `#F0FDFA` | `bg-teal-50` | AI panel background, selection highlights |

### Status & Feedback
| State | Background | Border | Text | Icon Color |
|---|---|---|---|---|
| **Draft** | `bg-amber-50` (`#FEF3C7`) | `border-amber-200` | `text-amber-800` | `text-amber-600` |
| **Submitted** | `bg-emerald-50` (`#ECFDF5`)| `border-emerald-300` | `text-emerald-800`| `text-emerald-600` |
| **Ready to Submit**| `bg-teal-50` | `border-teal-200` | `text-teal-800` | `text-teal-600` |
| **Queued (Offline)**| `bg-indigo-50` (`#EEF2FF`)| `border-indigo-200` | `text-indigo-800` | `text-indigo-600` |
| **Not Billable** | `bg-slate-100` (`#F1F5F9`)| `border-slate-300` | `text-slate-700` | `text-slate-500` |
| **Error / Alert** | `bg-red-50` (`#FEF2F2`) | `border-red-200` | `text-red-900` | `text-red-600` |
| **Withdrawn** | `bg-amber-100` | `border-amber-300` | `text-amber-900` | `text-amber-700` |

---

## 2. Typography

- **Font Family**: `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Scale**:
  - `text-[10px]`: Metadata tags, uppercase subheaders
  - `text-xs` (`12px`): Helper text, table cells, badge labels, timestamps
  - `text-sm` (`14px`): Form inputs, button labels, card body text
  - `text-base` (`16px`): Primary card titles, modal headlines
  - `text-lg` (`18px`): Section titles, modal titles
  - `text-xl` (`20px`): Page headings, sub-hero titles
  - `text-2xl` (`24px`): Main page titles
  - `text-3xl` (`30px`): Hero greeting

---

## 3. Spacing & Layout

- **Base Unit**: `4px` (`0.25rem`)
- **Common Margins & Gaps**:
  - Component inner padding: `16px` (`p-4`) or `20px` (`p-5`)
  - Card grid gaps: `12px` (`gap-3`) or `16px` (`gap-4`)
  - Form field stacks: `16px` (`space-y-4`) to `20px` (`space-y-5`)
  - Container max-width: `max-w-5xl` (`1024px`)

---

## 4. Elevation & Shadows

| Token | CSS Box Shadow | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Input fields, small badges |
| `shadow-card` | `0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)` | Standard session and student cards |
| `shadow-card-hover` | `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)` | Hover state on clickable cards |
| `shadow-modal` | `0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)` | Desktop modal dialogs |
| `shadow-sheet` | `0 -10px 25px -5px rgba(15, 23, 42, 0.12)` | Mobile bottom sheet flyout |

---

## 5. Border Radius

- `rounded-md`: `6px` (Status badges, quick-preset pills)
- `rounded-lg`: `8px` (Form inputs, standard buttons)
- `rounded-xl`: `12px` (Cards, banners, small dialogs)
- `rounded-2xl`: `16px` (Panels, form containers, bottom sheets)
- `rounded-3xl`: `24px` (Dashboard hero card)
- `rounded-full`: `9999px` (Avatars, step icons, circular badges)

---

## 6. Focus & Accessibility Tokens

- **Focus Visible**: `outline-none ring-2 ring-teal-600 ring-offset-2 ring-offset-white`
- **Error Focus**: `focus:ring-red-500 focus:border-red-500`
- **Minimum Touch Target**: `min-h-[44px]` and `min-w-[44px]` on all interactive elements.

---

## 7. Responsive Breakpoints

| Breakpoint | Min-Width | Target Viewport |
|---|---|---|
| `sm` | `640px` | Large phones & small tablets |
| `md` | `768px` | Tablets portrait |
| `lg` | `1024px` | Tablets landscape & laptops (2-column layout active) |
| `xl` | `1280px` | Large desktop monitors |
