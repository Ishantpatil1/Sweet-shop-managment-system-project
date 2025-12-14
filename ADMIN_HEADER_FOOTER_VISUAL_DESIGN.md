# Admin Header & Footer Visual Design Specification

## Design Philosophy

The admin header and footer follow an **enterprise dashboard aesthetic**:
- **Calm, distraction-free** interface
- **Information-focused** over decoration
- **Professional, neutral** appearance
- **High usability** for repetitive daily tasks
- **Minimal visual noise** with clear visual hierarchy

---

## AdminHeader - Detailed Visual Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  🍬 SweetMart Admin  │  Dashboard  Manage Sweets  │  Admin Logout│
└─────────────────────────────────────────────────────────────────┘
   Left (Branding)      Center (Nav)         Right (User/Actions)
```

### Height & Spacing

| Property | Value | Notes |
|----------|-------|-------|
| **Total Height** | 56px (h-14) | Compact, professional |
| **Content Padding** | Flex container | Vertically centered auto |
| **Horizontal Container** | Max-width | Prevents layout stretching |
| **Inner Gaps** | gap-2, gap-4 | Consistent spacing |

### Left Section - Branding

#### Desktop View (1024px+)
```
🍬 SweetMart Admin
```
- Emoji: 🍬 (text-lg = 18px)
- "SweetMart": Bold text (font-semibold)
- "Admin": Light gray label (text-sm, #9E9E9E)

**Colors**:
- Text: #1F1F1F (dark gray)
- Label: #9E9E9E (muted gray)

**Typography**:
- Font Size: 18px (emoji), 16px (text)
- Font Weight: semibold for "SweetMart", normal for "Admin"
- No hover effect (non-interactive)

#### Tablet View (640-1023px)
```
🍬 SweetMart
```
- "Admin" label hidden
- Emoji and text both visible

#### Mobile View (<640px)
```
🍬
```
- Only emoji visible
- Text hidden completely

### Center Section - Navigation

#### Desktop View (1024px+)
Two navigation links displayed side-by-side:

```
┌──────────────┐ ┌─────────────────┐
│ Dashboard    │ │ Manage Sweets   │
└──────────────┘ └─────────────────┘
```

**Inactive Link State**:
- Text Color: #6B6B6B (medium gray)
- Background: Transparent
- Border: None
- Padding: px-3 py-2 (12px horizontal, 8px vertical)
- Font Size: 14px (text-sm)
- Font Weight: medium
- Border Radius: Rounded corners

**Inactive Link Hover State**:
- Text Color: #1F1F1F (darker gray)
- Background: #FFF3E0 (light orange)
- Border: None
- Transition: 150ms
- Effect: Subtle highlight

**Active Link State** (Current Page):
- Text Color: #F4A261 (orange accent)
- Background: Transparent
- Border: 2px bottom border, #F4A261 (orange)
- Icon/Indicator: Bottom border only (no underline)

**Active Link Hover State**:
- Same as active (no additional change)

#### Tablet View (640-1023px)
- Navigation hidden completely

#### Mobile View (<640px)
- Navigation hidden completely

### Right Section - User & Logout

#### Layout
```
Admin [Logout Button]
```

#### User Role Badge

**Desktop & Tablet (640px+)**:
- Text: "Admin" or username
- Style: Uppercase, very small text
- Color: #9E9E9E (muted gray)
- Font Size: 12px (text-xs)
- Font Weight: medium
- Letter Spacing: wide (tracking-wide)
- Spacing: 2px gap between label and button

**Mobile (<640px)**:
- Hidden completely

#### Logout Button

**Desktop View**:
```
🚪 Logout
```
- Icon: LogOut from lucide-react (18px)
- Text: "Logout" (12px, medium weight)
- Padding: p-2 (8px all around)
- Border Radius: Rounded (rounded-lg)
- Gap: 4px between icon and text

**Tablet View (640px+)**:
```
🚪 Logout
```
- Same as desktop
- Text visible

**Mobile View (<640px)**:
```
🚪
```
- Icon only
- Text hidden
- Smaller touch target still 44px minimum (padding)

**Button States**:

*Inactive*:
- Color: #6B6B6B (medium gray)
- Background: Transparent
- Border: None

*Hover*:
- Color: #F4A261 (orange accent)
- Background: #FFF3E0 (light orange)
- Border: None
- Transition: 150ms ease-out

*Active/Pressed*:
- Same as hover (browser default)
- No additional styling

*Focus*:
- Browser default focus ring
- No custom focus styling

### Full-Width Header Border

- **Position**: Bottom edge
- **Color**: #E8D4C8 (subtle tan)
- **Width**: 1px (border-b)
- **Extends**: Full width (no padding on border)

### Background & Overlay

- **Background Color**: White (bg-white)
- **Shadow**: None
- **Backdrop**: None
- **Opacity**: 100% (no transparency)

### Positioning

- **Position**: Sticky (sticky top-0)
- **Z-Index**: 40 (z-40)
- **Top Offset**: 0px
- **Behavior**: Stays visible while scrolling page content below

---

## AdminFooter - Detailed Visual Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ © 2025 SweetMart Admin  •  v1.0.0  •  [dev]    Admin Dashboard  │
└─────────────────────────────────────────────────────────────────┘
   Left (System Context)                      Right (Context Label)
```

### Height & Spacing

| Property | Value | Notes |
|----------|-------|-------|
| **Total Height** | 48px (h-12) | Compact, minimal |
| **Content Padding** | Flex container | Vertically centered |
| **Horizontal Container** | Max-width | Matches header |
| **Text Spacing** | 12px gap | Between sections |

### Left Section - System Context

#### Information Display

1. **Copyright**:
   - Format: `© YEAR SweetMart Admin`
   - Example: `© 2025 SweetMart Admin`
   - Separator: Bullet point (•) with margin

2. **Version**:
   - Format: `v1.0.0`
   - Separator: Bullet point (•) with margin
   - Dynamic version number from props

3. **Environment Badge** (Dev/Staging only):
   - Format: Uppercase text in colored box
   - Separator: Bullet point (•) with margin
   - Hidden if environment is "prod"

#### Environment Badge Colors

**Development Environment**:
```
┌────────────┐
│    dev     │  Orange
└────────────┘
```
- Background: #FFF3E0 (light orange)
- Text: #E65100 (dark orange)
- Font Size: 12px (text-xs)
- Font Weight: medium
- Padding: px-2 py-0.5 (8px h, 2px v)
- Border Radius: Rounded

**Staging Environment**:
```
┌────────────┐
│ staging    │  Light Orange
└────────────┘
```
- Background: #FFE0B2 (lighter orange)
- Text: #E65100 (dark orange)
- Same sizing and styling as dev

**Production Environment**:
- Badge hidden completely
- Only copyright and version shown
- No environment indicator needed

#### Text Styling

- **Font Size**: 12px (text-xs)
- **Font Weight**: Regular (400)
- **Color**: #9E9E9E (muted gray)
- **Family**: Default (Tailwind sans)

#### Separators

- **Style**: Bullet point (•)
- **Color**: #D0D0D0 (light gray)
- **Spacing**: 12px gap before and after

### Right Section - Context Label

**Desktop & Tablet (640px+)**:
```
Admin Dashboard
```
- Text: "Admin Dashboard"
- Color: #6B6B6B (medium gray)
- Font Size: 12px (text-xs)
- Font Weight: Regular (400)
- Hidden on mobile

**Mobile (<640px)**:
- Hidden completely

### Full-Width Footer Border

- **Position**: Top edge
- **Color**: #E8D4C8 (subtle tan)
- **Width**: 1px (border-t)
- **Extends**: Full width (no padding on border)

### Background & Overlay

- **Background Color**: White (bg-white)
- **Shadow**: None
- **Backdrop**: None
- **Opacity**: 100% (no transparency)

### Positioning

- **Position**: Static (mt-auto via parent flexbox)
- **Sticky to Bottom**: Uses flexbox layout on parent
- **Parent Structure**: `<div className="flex flex-col">` with flex-1 content
- **Behavior**: Pushed to bottom when content is short

---

## Color Palette Reference

### Primary Colors

| Usage | Color | Hex | RGB | Tailwind |
|-------|-------|-----|-----|----------|
| Primary Accent | Orange | #F4A261 | rgb(244, 162, 97) | Custom |
| White Background | White | #FFFFFF | rgb(255, 255, 255) | white |
| Cream Background | Cream | #FFF8F0 | rgb(255, 248, 240) | Custom |

### Text Colors

| Usage | Color | Hex | RGB | Tailwind |
|-------|-------|-----|-----|----------|
| Primary Text | Dark Gray | #1F1F1F | rgb(31, 31, 31) | gray-900 |
| Secondary Text | Medium Gray | #6B6B6B | rgb(107, 107, 107) | gray-600 |
| Muted Text | Light Gray | #9E9E9E | rgb(158, 158, 158) | gray-400 |
| Separator Text | Very Light Gray | #D0D0D0 | rgb(208, 208, 208) | gray-300 |

### Accent Colors

| Usage | Color | Hex | RGB | Tailwind |
|-------|-------|-----|-----|----------|
| Hover Background | Light Orange | #FFF3E0 | rgb(255, 243, 224) | Custom |
| Border Color | Subtle Tan | #E8D4C8 | rgb(232, 212, 200) | Custom |

### Environment Badge Colors

| Environment | Background | Text | Hex (BG) | Hex (Text) |
|-------------|-----------|------|----------|-----------|
| Development | Light Orange | Dark Orange | #FFF3E0 | #E65100 |
| Staging | Lighter Orange | Dark Orange | #FFE0B2 | #E65100 |
| Production | Green | Dark Green | #E8F5E9 | #2E7D32 |

---

## Typography Specification

### Font Family
- **Font**: Tailwind default (system fonts)
- **Fallback Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', ...`

### Font Sizes

| Size | Px | Tailwind | Usage |
|------|----|---------:|-------|
| **XS** | 12px | text-xs | Footer, badges, role label |
| **SM** | 14px | text-sm | Nav links, logout text |
| **BASE** | 16px | text-base | Branding text |
| **LG** | 18px | text-lg | Branding emoji |
| **XL** | 20px | text-xl | (Not used in header/footer) |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| **Regular** | 400 | Footer text, nav inactive |
| **Medium** | 500 | Nav links, badges, logout |
| **Semibold** | 600 | Branding "SweetMart" |

### Line Height

- Default (1.5) for all text
- No custom line-height adjustments needed

---

## Spacing System

### Gaps & Margins

| Size | Px | Tailwind | Usage |
|------|----|---------:|-------|
| **2** | 8px | gap-2 | Branding elements |
| **3** | 12px | gap-3 | Footer sections |
| **4** | 16px | gap-4 | Header right section |

### Padding

| Size | Px | Tailwind | Usage |
|------|----|---------:|-------|
| **2** | 8px | p-2 | Logout button |
| **3** | 12px | px-3 py-2 | Nav link padding |

### Container

- **Max-width**: Same as main container (likely 1200px or content-based)
- **Padding**: Consistent with page layout

---

## Transitions & Animations

### Duration

All transitions: **150ms** (fast)

### Easing

Default CSS easing (linear)

### Animated Properties

| Element | Property | Duration |
|---------|----------|----------|
| Nav Link | color, background-color | 150ms |
| Logout Button | color, background-color | 150ms |

### No Animations

- No fade-in/fade-out on header/footer
- No scale/transform effects
- No keyframe animations
- Snap transitions only (CSS only)

---

## Responsive Grid

### Breakpoints

| Breakpoint | Width | Header | Footer |
|-----------|-------|--------|--------|
| **Mobile** | <640px | Icon-only branding, no nav, icon-only logout | Right section hidden |
| **sm (tablet)** | 640px+ | Full branding, logout text visible, no nav | Right section visible |
| **md (desktop)** | 768px+ | Navigation appears | No change |
| **lg+ (wide)** | 1024px+ | Full layout optimized | No change |

### Mobile-First CSS

```
/* Mobile first (all screens) */
- Icon branding
- Hidden nav
- Icon-only logout

/* sm (640px+) */
- Full branding
- Logout text visible

/* md (768px+) */
- Navigation appears
```

---

## Accessibility Specifications

### Semantic HTML

- `<header role="banner">` wrapper
- `<nav role="navigation" aria-label="Admin navigation">` for nav section
- `<footer>` wrapper (implicit footer element)
- `<a>` for navigation links
- `<button>` for logout (interactive action)
- `<span>` for text content

### Focus States

- **Visible**: Yes, browser default focus ring
- **Color**: Browser default (usually blue outline)
- **Width**: 2-4px (browser default)
- **Offset**: 2px (browser default)

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Logout Button | aria-label | "Logout" |
| Nav Section | aria-label | "Admin navigation" |
| Active Link | aria-current | "page" |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between focusable elements |
| Shift+Tab | Move backward between elements |
| Enter | Activate link or button |
| Space | Activate button (if focused) |

### Screen Reader

- All text content is visible and readable
- Navigation structure announced properly
- Current page link announced with `aria-current="page"`
- Buttons labeled with accessible text or aria-label

---

## Interaction States Diagram

### Nav Link States

```
Inactive (Default)
├─ Text: #6B6B6B
├─ Background: Transparent
├─ Border: None
└─ Cursor: pointer

Inactive → Hover
├─ Text: #1F1F1F (darker)
├─ Background: #FFF3E0 (light orange)
├─ Border: None
└─ Duration: 150ms

Active (Current Page)
├─ Text: #F4A261 (orange)
├─ Background: Transparent
├─ Border: 2px bottom #F4A261
└─ Cursor: default

Active → Hover
└─ No change (already highlighted)
```

### Logout Button States

```
Default
├─ Text: #6B6B6B
├─ Background: Transparent
├─ Border: None
└─ Cursor: pointer

Default → Hover
├─ Text: #F4A261 (orange)
├─ Background: #FFF3E0 (light orange)
├─ Border: None
└─ Duration: 150ms

Pressed
├─ Text: #F4A261
├─ Background: #FFF3E0
└─ Duration: Instant

Focus (Keyboard)
└─ Browser default focus ring
```

---

## Final Visual Hierarchy

### AdminHeader Visual Weight

1. **Highest**: Navigation links (center, active state orange)
2. **High**: Branding/Logo (left, semibold)
3. **Medium**: Logout button (right, interactive)
4. **Low**: User role label (right, muted text)

### AdminFooter Visual Weight

1. **Highest**: Copyright & version (left, required info)
2. **High**: Environment badge (if dev/staging, colored)
3. **Low**: Right context label (muted, hidden on mobile)

---

## Design Consistency Notes

- Both header and footer use the same color palette
- Spacing and typography follow Tailwind defaults
- No custom CSS files (Tailwind only)
- Transitions are consistent (150ms)
- All interactive elements have hover states
- Mobile-first responsive design
- Full accessibility compliance (WCAG AA)

---

## Summary

The Admin Header and Footer represent a **professional, efficient** admin interface:
- **Compact**: 56px header, 48px footer
- **Information-focused**: No decoration, content-first
- **Accessible**: Full semantic HTML and ARIA support
- **Responsive**: Graceful degradation to mobile
- **Consistent**: Unified color and spacing system
- **Interactive**: Clear hover and active states
- **Minimal**: No animations or visual noise

This design supports daily administrative work by providing clear navigation and system context without distracting from core tasks.
