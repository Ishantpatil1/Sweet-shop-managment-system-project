# Admin Header & Footer Quick Reference

## Components Overview

### AdminHeader
**Location**: `web/src/components/AdminHeader.tsx`

**Purpose**: Professional, compact navigation header for admin pages

**Props**:
```typescript
interface AdminHeaderProps {
  userName?: string;      // Admin's name (default: 'Admin')
  onLogout: () => void;   // Logout handler function
}
```

**Usage**:
```tsx
import AdminHeader from '../components/AdminHeader';

// In your component
<AdminHeader 
  onLogout={handleLogout} 
  userName={user?.name || 'Admin'} 
/>
```

**Features**:
- ✅ Compact 56px height
- ✅ Responsive branding (icon-only on mobile)
- ✅ Desktop navigation (Dashboard, Manage Sweets)
- ✅ Active link highlighting
- ✅ Role badge display
- ✅ Responsive logout button (icon-only on mobile)
- ✅ Sticky positioning
- ✅ Accessibility (semantic HTML, ARIA labels)

**Visual Style**:
- White background with subtle bottom border
- Orange accent (#F4A261) for active/hover states
- Muted text colors (#1F1F1F, #6B6B6B, #9E9E9E)
- Fast transitions (150ms)

---

### AdminFooter
**Location**: `web/src/components/AdminFooter.tsx`

**Purpose**: Subtle system context footer for admin pages

**Props**:
```typescript
interface AdminFooterProps {
  year?: number;                           // Copyright year (default: current year)
  version?: string;                        // App version (default: '1.0.0')
  environment?: 'dev' | 'prod' | 'staging'; // Environment (default: 'prod')
}
```

**Usage**:
```tsx
import AdminFooter from '../components/AdminFooter';

// In your component
<AdminFooter 
  version="1.0.0" 
  environment="prod" 
/>
```

**Features**:
- ✅ System information display
- ✅ Copyright and version
- ✅ Environment badge (dev/staging only)
- ✅ Responsive design (right section hidden on mobile)
- ✅ Sticky to bottom with flexbox layout
- ✅ Semantic footer structure

**Visual Style**:
- White background with subtle top border
- Very small, muted text
- Environment badges with color coding:
  - **dev**: Orange background
  - **staging**: Light orange background
  - **prod**: Hidden (green badge, but not shown)
- No visual clutter or decorations

---

## Page Integration

### AdminDashboard
```tsx
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

export default function AdminDashboard() {
  // ... component logic ...

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <AdminHeader onLogout={handleLogout} userName={user?.name || 'Admin'} />
      
      <div className="container">
        {/* Page content */}
      </div>

      <AdminFooter version="1.0.0" environment="prod" />
    </div>
  );
}
```

### ManageSweets
```tsx
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

export default function ManageSweets() {
  // ... component logic ...

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <AdminHeader onLogout={handleLogout} userName={user?.name || 'Admin'} />
      
      <div className="container">
        {/* Page content */}
      </div>

      <AdminFooter version="1.0.0" environment="prod" />
    </div>
  );
}
```

---

## Design System Colors

| Usage | Color | Hex Value |
|-------|-------|-----------|
| Primary Accent | Orange | #F4A261 |
| Primary Text | Dark Gray | #1F1F1F |
| Secondary Text | Medium Gray | #6B6B6B |
| Muted Text | Light Gray | #9E9E9E |
| Border | Subtle Tan | #E8D4C8 |
| Background | Cream | #FFF8F0 |
| Hover Background | Light Orange | #FFF3E0 |
| Dev Badge | Orange | #FFF3E0 / #E65100 |
| Staging Badge | Light Orange | #FFE0B2 / #E65100 |
| Prod Badge | Green | #E8F5E9 / #2E7D32 |

---

## Responsive Behavior

| Element | Mobile | Tablet (sm) | Desktop (md+) |
|---------|--------|------------|---------------|
| **Header** | | | |
| Branding | Icon only | Full + "Admin" | Full + "Admin" |
| Navigation | Hidden | Hidden | Visible |
| Logout | Icon only | Icon + Text | Icon + Text |
| User Role | Hidden | Visible | Visible |
| **Footer** | | | |
| Right section | Hidden | Visible | Visible |

---

## Navigation Links

AdminHeader automatically highlights the active link based on current route:

| Route | Label |
|-------|-------|
| `/admin/dashboard` | Dashboard |
| `/admin/manage` | Manage Sweets |
| `#inventory` | Inventory (placeholder) |
| `#purchases` | Purchases (placeholder) |

Active link shows:
- Orange text color (#F4A261)
- Bottom border (2px orange)

---

## Accessibility

### Semantic HTML
```tsx
<header role="banner">        // AdminHeader
  <nav role="navigation" aria-label="Admin navigation">
    <a aria-current="page">   // Active link
  </nav>
</header>

<footer>                      // AdminFooter
```

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate links and buttons
- Focus states visible on all elements

### ARIA Labels
- `aria-label="Logout"` on logout button
- `aria-label="Admin navigation"` on nav section
- `aria-current="page"` on active nav link

---

## Common Use Cases

### Add AdminHeader to New Admin Page
```tsx
import AdminHeader from '../components/AdminHeader';

export default function NewAdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <AdminHeader 
        onLogout={handleLogout} 
        userName={user?.name || 'Admin'} 
      />
      {/* Page content */}
    </div>
  );
}
```

### Add AdminFooter with Dev Environment
```tsx
import AdminFooter from '../components/AdminFooter';

// In your component
<AdminFooter 
  version="1.0.0-beta" 
  environment="dev" 
/>
```

### Update Version on Release
```tsx
// In AdminDashboard and ManageSweets pages
<AdminFooter version="1.1.0" environment="prod" />
```

---

## Styling Customization

Both components use Tailwind CSS classes. To customize styling:

1. **AdminHeader** (`web/src/components/AdminHeader.tsx`):
   - Line 27: `h-14` - Header height
   - Line 33: Colors in branding section
   - Line 47: Navigation spacing and colors
   - Line 68: Button colors and hover states

2. **AdminFooter** (`web/src/components/AdminFooter.tsx`):
   - Line 21: `h-12` - Footer height
   - Line 22: Colors and spacing
   - Line 16-18: Environment badge colors

---

## Troubleshooting

### Navigation Links Not Highlighting
**Issue**: Active link color doesn't show

**Solution**: Check that route path exactly matches nav link path:
- Dashboard link: `/admin/dashboard`
- Manage Sweets link: `/admin/manage`

### Logout Not Working
**Issue**: Logout button doesn't trigger handler

**Solution**: Ensure `onLogout` prop is properly passed and function is defined:
```tsx
const handleLogout = () => {
  localStorage.removeItem('token');
  setUser(null);
  navigate('/login', { replace: true });
};

<AdminHeader onLogout={handleLogout} />
```

### Footer Not Sticky
**Issue**: Footer doesn't stay at bottom

**Solution**: Ensure parent div uses flexbox:
```tsx
<div className="min-h-screen flex flex-col">
  <AdminHeader />
  <div className="flex-1">Content</div>
  <AdminFooter />
</div>
```

---

## Migration from Old Header/Footer

If migrating from generic Header/Footer components:

```tsx
// OLD
import Header from '../components/Header';
import Footer from '../components/Footer';

<Header title="Manage" subtitle="Sweets" icon="📦" onLogout={handleLogout} />
<Footer variant="admin" />

// NEW
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

<AdminHeader onLogout={handleLogout} userName={user?.name || 'Admin'} />
<AdminFooter version="1.0.0" environment="prod" />
```

---

## Related Components

- **Storefront Page**: Uses generic `Header` component (not AdminHeader)
- **Register/Login Pages**: Use generic `Header` component (not AdminHeader)
- **Footer Component**: Generic footer used by Storefront (kept separate)

---

## Version History

- **v1.0.0** (Current): Initial release with AdminHeader and AdminFooter
  - Compact, professional admin navigation
  - System context footer
  - Full responsive design
  - Complete accessibility support
