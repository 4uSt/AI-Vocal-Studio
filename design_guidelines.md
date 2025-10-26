# Design Guidelines: Ultimate AI Vocal Mixing Studio

## Design Approach

**Selected System:** Carbon Design System (IBM) with DAW/Studio Interface Principles

**Justification:** This professional audio production tool requires exceptional information density, precision controls, and complex workflow management. Carbon Design System excels at data-heavy enterprise applications while maintaining usability. We'll adapt its patterns for the specialized needs of audio engineering interfaces.

**Core Design Principles:**
1. **Information Density**: Maximize visible parameters without overwhelming users
2. **Precision First**: Every control must support exact values and fine adjustments
3. **Workflow Continuity**: Minimize context switching; keep related tools adjacent
4. **Professional Aesthetic**: Match industry-standard DAW interfaces for immediate familiarity

---

## Typography

**Font Families:**
- Primary: IBM Plex Sans (via Google Fonts CDN) - clean, technical, optimized for UI density
- Monospace: IBM Plex Mono - for numerical values, timecodes, frequency displays

**Hierarchy:**
- **Section Headers:** 16px, semi-bold (600) - module titles, panel headers
- **Subsection Labels:** 14px, medium (500) - parameter groups, effect names
- **Body/Parameters:** 13px, regular (400) - parameter labels, descriptions
- **Values/Meters:** 12px, mono, medium - numerical readouts, timecodes
- **Helper Text:** 11px, regular - tooltips, contextual guidance
- **Micro Labels:** 10px, medium - unit indicators (dB, Hz, ms)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8, 12** for consistent rhythm
- Tight groupings: p-2, gap-2
- Standard spacing: p-4, gap-4, mb-6
- Section separation: py-8, gap-8, mb-12

**Grid Structure:**
```
Main Layout (Full Height):
- Top Bar: h-14 (navigation, transport controls, session info)
- Content Area: flex-1 (3-column layout)
  - Left Panel: w-80 (chain builder, module library)
  - Center: flex-1 (waveform/spectrogram, main workspace)
  - Right Panel: w-96 (AI chat, parameter controls)
- Bottom Bar: h-24 (meters, health checks, export controls)

Responsive breakpoints:
- Desktop (lg+): 3-column with all panels visible
- Tablet (md): 2-column, collapsible right panel
- Mobile: Single column, tabbed navigation
```

---

## Component Library

### Navigation & Structure

**Top Bar:**
- Fixed height: h-14
- Horizontal layout with space-between
- Left: Logo + session name
- Center: Transport controls (play, pause, stop, loop)
- Right: User menu, settings, help

**Panel Headers:**
- h-12 sticky headers
- Icon + title + action buttons
- Collapse/expand controls

**Tabs (Mode Selection):**
- Horizontal tabs for Auto-Mix / Guided Mix
- Active tab with bottom border indicator
- Icon + label combination

### Audio Visualization

**Waveform Display:**
- Full-width container with max-h-48
- Waveform rendered as SVG or Canvas
- Playhead indicator line
- Time ruler below (12px mono font)
- Selection/loop region overlays

**Spectrogram:**
- Toggleable view below waveform
- Height: h-64
- Frequency labels on Y-axis (Hz, mono font)
- Time-aligned with waveform

**Issue Highlighting:**
- Overlay markers on waveform/spectrogram
- Small badges indicating problem type
- Clickable to show explanation popover

### Chain Builder (Left Panel)

**Module List:**
- Vertical stack with gap-2
- Each module: rounded-lg card
- Drag handle icon on left
- Module name + type badge
- Bypass toggle on right
- Expand/collapse for parameters
- Reorder via drag-and-drop

**Module Card (Collapsed):**
- h-12 compact view
- Flex row: drag-handle | icon | name | badges | bypass | expand

**Module Card (Expanded):**
- Auto-height based on parameters
- Parameter grid inside with gap-3
- Per-parameter: label + value + slider/input

**Chain Flow Indicators:**
- Vertical connecting lines between modules
- Parallel routing shown with split/merge icons
- Serial chain as straight line

### Parameter Controls

**Slider:**
- Full-width with precise value input
- Range indicators (min/max labels)
- Current value displayed above
- Snap to common values option

**Knob (Rotary Control):**
- 48px × 48px circular control
- Arc indicator showing value
- Click-drag vertical for adjustment
- Double-click to reset
- Label below, value above

**Toggle/Switch:**
- Standard checkbox-style toggle
- Clear on/off states
- Label to the right

**Dropdown/Select:**
- h-10 height
- Chevron icon indicator
- Full-width in container
- Menu overlay on interaction

**Numerical Input:**
- Monospace font
- Unit suffix (dB, Hz, ms, %)
- Arrow controls for increment/decrement
- Direct text entry supported

### AI Chat Interface (Right Panel)

**Chat Container:**
- Flex column with gap-4
- Scrollable message area
- Input at bottom (sticky)

**Message Bubbles:**
- AI messages: left-aligned, max-w-xs
- User messages: right-aligned, max-w-xs
- Timestamp in micro font below
- Avatar/icon for AI messages

**Input Area:**
- h-12 text input with rounded corners
- Send button integrated on right
- Microphone icon for voice input
- "Thinking..." indicator when processing

**Quick Actions:**
- Pill-shaped buttons above input
- Common requests: "Explain this", "Make it brighter", "Add more space"
- Grid layout with gap-2

### Comparison Tools

**A/B Snapshot Buttons:**
- Horizontal row of snapshot slots
- Each: 64px × 48px card
- Label (A, B, C) + timestamp
- Active state indicator
- Click to load, long-press to save

**Loudness-Matched Toggle:**
- Prominent switch with indicator
- Shows current compensation (e.g., "+2.3 dB")

### Reference Matching

**Reference Track Upload:**
- Drag-drop zone with h-32
- Mini waveform preview once loaded
- Remove button

**Target Curve Display:**
- Frequency response graph
- Overlay: reference (line) vs current (filled area)
- Interactive adjustment handles

### Export Panel (Modal/Slide-over)

**Export Options:**
- Vertical list with checkboxes
- Text/PDF chain ✓
- DAW-specific recipes (dropdown to select DAW)
- Preset files (when available)

**Preview:**
- Scrollable text preview of export content
- Copy button per section

### Metering

**Level Meters (Bottom Bar):**
- Horizontal stereo meter: h-8 each
- Peak indicators
- LUFS/RMS display in mono font
- Headroom indicator

**Phase Correlation:**
- Small circular meter (48px)
- Goniometer visualization

**Frequency Analyzer:**
- Optional panel showing real-time FFT
- h-48 compact analyzer

### Modals & Overlays

**Tooltips:**
- Max-w-xs with p-3
- Arrow pointing to source
- Concise helper text + optional "Learn more" link

**Popovers (Parameter Explanations):**
- Max-w-md with p-4
- Title + description
- "Why this setting" section
- Alternative suggestions
- Audio snippet play button (optional)

**Confirmation Dialogs:**
- Centered modal with max-w-md
- Title + message + action buttons
- Escape to dismiss

### Status & Feedback

**Progress Indicators:**
- Linear progress bar for analysis
- Circular spinner for AI thinking
- Percentage text for file processing

**Notifications/Toasts:**
- Top-right corner positioning
- Auto-dismiss after 4s
- Success, warning, error variants
- Stacked with gap-2

**Health Check Badges:**
- Small circular indicators
- Status: good (check icon), warning (alert), error (x)
- Tooltip with details

---

## Responsive Behavior

**Desktop (1280px+):**
- Full 3-column layout
- All panels visible simultaneously
- Chain builder: w-80
- Center workspace: flex-1
- Right panel: w-96

**Tablet (768px-1279px):**
- 2-column layout
- Left + Center always visible
- Right panel as slide-over overlay
- Toggle button to show/hide right panel

**Mobile (<768px):**
- Single column with tabbed navigation
- Bottom tab bar: Waveform | Chain | AI | Export
- Simplified parameter controls
- Stacked layout with overflow scroll

---

## Interaction Patterns

**Drag & Drop:**
- Visual feedback: semi-transparent ghost on drag
- Drop zones highlighted with dashed border
- Snap-to-grid for precise placement

**Keyboard Shortcuts:**
- Space: Play/Pause
- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
- Arrow keys: Navigate parameters
- Enter: Confirm value entry

**Undo/Redo:**
- Visible buttons in top bar
- Keyboard shortcuts
- State snapshot system

**Snapshot Management:**
- Quick save: Cmd/Ctrl + S
- Snapshot slots numbered 1-9
- Visual diff indicator between snapshots

---

## Information Architecture

**Primary Sections:**
1. **Analysis & Visualization** (Center top): Waveform, spectrogram, transport
2. **Chain Builder** (Left): Drag-drop modules, ordering, routing
3. **Parameter Control** (Right top): Active module parameters
4. **AI Assistant** (Right bottom): Chat, guidance, explanations
5. **Metering & Health** (Bottom): Levels, phase, quality checks
6. **Export & Session** (Top right menu): Save, export, settings

**Logical Flow:**
Upload → Analyze → Build Chain → Adjust Parameters → A/B Compare → Export

---

## Icons

**Library:** Heroicons (via CDN)
- Outline style for toolbar/navigation
- Solid style for active states and emphasis
- Consistent 20px or 24px sizing
- Audio-specific: Use `<!-- CUSTOM ICON: description -->` for waveform, EQ curve, compressor, etc.

---

## Accessibility

- Maintain WCAG AA contrast ratios throughout
- All interactive elements keyboard-accessible
- Focus indicators visible on all controls
- ARIA labels for all audio controls and meters
- Screen reader announcements for processing states
- Alternative text for all visualizations