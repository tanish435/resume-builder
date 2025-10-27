# Resume Builder - Full Stack Assignment

> **⚠️ Development Status:** This project was developed using AI-assisted vibe coding methodology. The application has core functionality implemented but contains UI inconsistencies and known bugs that require further refinement.

A full-stack resume builder application inspired by Enhancv and FlowCV, built as part of the Engaze Full Stack Developer assignment.

## 🎯 Assignment Overview

This project demonstrates the implementation of a comprehensive resume builder with the following features:
- ✅ On-canvas section-based editing
- ✅ Design customization (colors, fonts, styles)
- ✅ Dynamic template switching
- ✅ Undo-redo functionality
- ✅ PDF export (text-based)
- ✅ Section reordering (drag-and-drop)
- ✅ Public sharing with shareable links

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Development Methodology](#development-methodology)
3. [Project Structure](#project-structure)
4. [Features Implemented](#features-implemented)
5. [Database Schema](#database-schema)
6. [Setup Instructions](#setup-instructions)
7. [API Documentation](#api-documentation)
8. [Known Issues & Limitations](#known-issues--limitations)
9. [Future Improvements](#future-improvements)
10. [Development Timeline](#development-timeline)

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Next.js 15.5.4 (App Router with TypeScript)
- **ORM:** Prisma 6.17.1
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js 4.24.11
- **Validation:** Zod 4.1.12
- **Password Hashing:** bcryptjs

### Frontend
- **Framework:** React 19.1.0 with Next.js
- **Styling:** Tailwind CSS 4
- **State Management:** Redux Toolkit 2.9.1
- **Icons:** Lucide React 0.546.0
- **Drag & Drop:** @dnd-kit 6.3.1
- **PDF Export:** jsPDF 3.0.3 + html2canvas 1.4.1

### Development Tools
- **Language:** TypeScript 5
- **Linting:** ESLint 9
- **Package Manager:** npm
- **Runtime:** Node.js 20+

---

## 🎨 Development Methodology

### AI-Assisted Vibe Coding Process

This project was developed using **AI-assisted vibe coding** (approximately 10-12 hours of active development) with the following approach:

#### Phase-by-Phase Development

**Phase 1-3: Foundation Setup (Hours 1-2)**
- Project initialization with Next.js + TypeScript
- Prisma ORM setup with PostgreSQL
- Database schema design and migrations
- Basic project structure

**Phase 4-6: Core Models & Redux (Hours 2-4)**
- Redux Toolkit store configuration
- State slices implementation (resume, editor, style, template, history)
- Middleware setup (auto-save, API sync, history)
- Type definitions

**Phase 7-9: Template System & PDF Export (Hours 4-6)**
- 6 template designs (Modern, Professional, Creative, Minimal, Compact, Base)
- Template switching functionality
- PDF export with jsPDF and html2canvas
- Share link generation

**Phase 10: Backend API Implementation (Hours 6-8)**
- RESTful API endpoints (8 total)
- Resume CRUD operations
- Share link management
- Template listing
- Public resume access

**Phase 10.2: Authentication System (Hours 8-9)**
- NextAuth.js configuration
- Credentials provider (email/username + password)
- Google OAuth provider
- User registration and sign-in pages
- Email verification system with tokens
- Password reset flow with secure links
- Auth middleware helpers

**Phase 11: UI/UX Polish (Hours 9-10)**
- Toast notification system
- Loading states and skeletons
- Empty state components
- Responsive layouts (mobile, tablet, desktop)
- Hover effects and animations
- Touch-friendly controls

**Phase 12: Advanced Features (Hours 10-11)**
- Hyperlink support in experience/education sections
- Skills formatting optimization (comma-separated display)
- Single-page optimization with font size auto-adjustment
- Page fit indicator
- Resume switcher for multiple resumes
- Template-specific layout improvements

**Phase 13: Production Build Fixes (Hours 11-12)**
- Fixed TypeScript type errors (Date → ISO string conversions)
- Removed invalid Prisma template relations
- Wrapped useSearchParams in Suspense boundaries for Next.js 15 compatibility
- Configured ESLint/TypeScript for production builds
- Optimized build configuration for deployment

#### AI Tools Utilized
- **ChatGPT/Claude:** Architecture planning, code generation, debugging
- **GitHub Copilot:** Code completion and suggestions
- **AI-Assisted Design:** Component structure and state management patterns

#### Vibe Coding Benefits
- Rapid prototyping and iteration
- Focus on architecture over boilerplate
- Efficient debugging with AI assistance
- Pattern-based development

#### Limitations Acknowledged
- UI/UX requires manual refinement
- Some edge cases not fully tested
- Component styling inconsistencies
- Authentication flow needs production hardening

---

## 📁 Project Structure

```
resume-builder/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Database seeding
│   └── migrations/                # Migration files
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   │   ├── [...nextauth]/ # NextAuth handler
│   │   │   │   ├── signup/        # User registration
│   │   │   │   ├── verify-email/  # Email verification
│   │   │   │   ├── forgot-password/ # Password reset request
│   │   │   │   └── reset-password/  # Password reset confirmation
│   │   │   ├── resumes/           # Resume CRUD
│   │   │   ├── share/             # Share link generation
│   │   │   ├── public/            # Public resume access
│   │   │   └── templates/         # Template listing
│   │   ├── auth/                  # Auth pages
│   │   │   ├── signin/            # Sign in page
│   │   │   ├── signup/            # Registration page
│   │   │   ├── verify-email/      # Email verification page
│   │   │   ├── forgot-password/   # Forgot password page
│   │   │   └── reset-password/    # Reset password page
│   │   ├── dashboard/             # User dashboard
│   │   ├── share/[slug]/          # Public share pages
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles + animations
│   ├── components/
│   │   ├── auth/                  # Auth components
│   │   │   └── SessionProvider.tsx
│   │   ├── editor/                # Editor components
│   │   │   ├── EditorPanel.tsx
│   │   │   ├── ExportControls.tsx
│   │   │   ├── ResumeSwitcher.tsx
│   │   │   ├── SectionManager.tsx
│   │   │   ├── ShareButton.tsx
│   │   │   ├── StyleCustomizer.tsx
│   │   │   └── TemplateSelector.tsx
│   │   ├── resume/                # Resume components
│   │   │   ├── EditableContent.tsx
│   │   │   ├── ResumeCanvas.tsx
│   │   │   ├── SectionWrapper.tsx
│   │   │   └── sections/          # Section components
│   │   ├── templates/             # Template designs
│   │   │   ├── BaseTemplate.tsx
│   │   │   ├── ModernTemplate.tsx
│   │   │   ├── ProfessionalTemplate.tsx
│   │   │   ├── CreativeTemplate.tsx
│   │   │   ├── MinimalTemplate.tsx
│   │   │   ├── CompactTemplate.tsx
│   │   │   ├── TemplateLoader.tsx
│   │   │   └── TemplatePreview.tsx
│   │   └── ui/                    # Reusable UI components
│   │       ├── Toast.tsx
│   │       ├── ToastContainer.tsx
│   │       ├── Loading.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Tooltip.tsx
│   │       ├── Button.tsx
│   │       ├── Form.tsx
│   │       ├── Card.tsx
│   │       ├── ResponsiveLayout.tsx
│   │       ├── ColorPicker.tsx
│   │       ├── FontSelector.tsx
│   │       ├── FontSizeControls.tsx
│   │       ├── BorderStyler.tsx
│   │       ├── SpacingControls.tsx
│   │       ├── ThemePresets.tsx
│   │       ├── PageFitIndicator.tsx
│   │       └── ZoomControls.tsx
│   ├── hooks/
│   │   ├── useToast.ts            # Toast notifications
│   │   └── useTemplateTransition.ts
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client
│   │   ├── auth.ts                # NextAuth config
│   │   ├── authHelpers.ts         # Auth middleware
│   │   ├── email.ts               # Email sending utilities
│   │   ├── pdfExport.ts           # PDF generation (advanced)
│   │   ├── pdfExportSimple.ts     # PDF generation (simple)
│   │   ├── shareUtils.ts          # Share link utils
│   │   ├── templates.ts           # Template definitions
│   │   ├── themes.ts              # Theme presets
│   │   ├── fontSizeUtils.ts       # Font size optimization
│   │   └── singlePageOptimizer.ts # Single-page optimization
│   ├── store/                     # Redux store
│   │   ├── index.ts               # Store configuration
│   │   ├── hooks.ts               # Typed hooks
│   │   ├── Provider.tsx           # Redux provider
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── apiSyncMiddleware.ts
│   │   │   ├── autoSaveMiddleware.ts
│   │   │   └── styleSyncMiddleware.ts
│   │   └── slices/                # State slices
│   │       ├── resumeSlice.ts
│   │       ├── editorSlice.ts
│   │       ├── styleSlice.ts
│   │       ├── templateSlice.ts
│   │       └── shareSlice.ts
│   ├── types/
│   │   ├── schema.ts              # Type definitions
│   │   └── next-auth.d.ts         # NextAuth types
│   └── styles/                    # Additional styles
├── tests/                         # Test files
│   ├── database.test.ts
│   ├── redux-store.test.ts
│   └── schema-validation.test.ts
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint configuration
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## ✨ Features Implemented

### 1. ✅ On-Canvas Editing
- **Section-based editing** directly inside the resume
- **Inline content editing** with auto-save
- **Real-time preview** of changes
- **Editable sections:** Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Interests
- **Hyperlink support** in experience and education sections (clickable links with visual indicators)

**Components:**
- `EditableContent.tsx` - Handles inline editing with hyperlink detection
- `SectionWrapper.tsx` - Wraps each section with edit controls
- `ResumeCanvas.tsx` - Main canvas for resume display

### 2. ✅ Design Customization
- **Color customization** (primary color picker)
- **Font selection** (10+ professional fonts)
- **Font size control** (12-18px range with auto-optimization for single-page fit)
- **Line height adjustment**
- **Spacing controls** (compact, normal, relaxed)
- **Border styling** (width, radius, color)
- **Theme presets** (Professional, Creative, Minimal, Bold)
- **Single-page optimization** with automatic font size reduction
- **Page fit indicator** showing when content exceeds one page

**Components:**
- `StyleCustomizer.tsx` - Style control panel
- `ColorPicker.tsx` - Color selection
- `FontSelector.tsx` - Font chooser with auto-optimization
- `BorderStyler.tsx` - Border controls
- `SpacingControls.tsx` - Spacing adjustments
- `ThemePresets.tsx` - Pre-made themes
- `PageFitIndicator.tsx` - Visual feedback for page overflow
- `FontSizeControls.tsx` - Font size adjustment with optimization
- `ZoomControls.tsx` - Canvas zoom for better editing

### 3. ✅ Template Switching
- **6 professional templates:**
  - Modern - Clean two-column design
  - Professional - Traditional single-column with optimized spacing
  - Creative - Bold with accent colors
  - Minimal - Simple and elegant
  - Compact - Space-efficient
  - Base - Classic layout
- **Instant preview** on hover
- **Smooth transitions** between templates
- **Template-specific optimizations** for better layout

### 4. ✅ Section Reordering
- **Drag-and-drop** functionality using @dnd-kit
- **Visual feedback** during dragging
- **Instant reordering** with smooth animations
- **Touch-friendly** controls for mobile devices

### 5. ✅ PDF Export
- **Text-based PDF** (not image snapshots)
- **High-quality export** with preserved formatting
- **Custom filename** support
- **Maintains styles** and layout
- **Optimized for single-page resumes**

**Note:** Undo/Redo functionality was intentionally removed from the final version to simplify state management and improve performance.

### 6. ✅ Public Sharing
- **Unique shareable links** (e.g., `/share/abc123xyz`)
- **Optional password protection**
- **Expiration dates** (1-365 days)
- **View count tracking**
- **Active/inactive status** toggle
- **Public view-only access** without authentication

### 7. ✅ User Authentication
- **NextAuth.js integration**
- **Credentials provider** (email/username + password)
- **Google OAuth** support
- **Password hashing** with bcryptjs
- **Email verification flow** with token-based verification
- **Password reset flow** with secure token generation
- **Protected routes** with middleware

**Auth Pages:**
- Sign In (`/auth/signin`)
- Sign Up (`/auth/signup`)
- Email Verification (`/auth/verify-email`)
- Forgot Password (`/auth/forgot-password`)
- Reset Password (`/auth/reset-password`)

### 8. ✅ Additional Features
- **Auto-save** every 3 seconds
- **Responsive design** (mobile, tablet, desktop)
- **Toast notifications** with success/error/info states
- **Loading states** and skeleton screens
- **Empty states** with helpful guidance
- **Resume switcher** for managing multiple resumes
- **Skills formatting** with comma-separated inline display
- **40+ reusable UI components**
- **Production-ready build** with Next.js 15 optimization

---

## 🗄️ Database Schema

### Core Models

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String?   @unique
  name          String?
  password      String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  resumes       Resume[]
  accounts      Account[]
  sessions      Session[]
}
```

#### Resume
```prisma
model Resume {
  id          String   @id @default(cuid())
  userId      String
  title       String   @default("Untitled Resume")
  templateId  String   @default("modern")
  styleConfig Json
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user          User
  sections      Section[]
  versions      ResumeVersion[]
  shareLinks    ShareLink[]
  template      Template
}
```

#### Section (Polymorphic Design)
```prisma
model Section {
  id         String      @id @default(cuid())
  resumeId   String
  type       SectionType
  data       Json        // Flexible JSON for different section types
  order      Int         @default(0)
  isVisible  Boolean     @default(true)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  resume Resume
}

enum SectionType {
  PERSONAL_INFO
  SUMMARY
  EXPERIENCE
  EDUCATION
  SKILLS
  PROJECTS
  CERTIFICATIONS
  LANGUAGES
  INTERESTS
  CUSTOM
}
```

#### ShareLink
```prisma
model ShareLink {
  id         String    @id @default(cuid())
  resumeId   String
  slug       String    @unique
  isActive   Boolean   @default(true)
  password   String?
  expiresAt  DateTime?
  viewCount  Int       @default(0)
  lastViewedAt DateTime?
  createdAt  DateTime  @default(now())

  resume Resume
}
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (local or cloud)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/tanish435/resume-builder.git
cd resume-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env` file in root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/resume_builder"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Configuration (for verification and password reset)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourapp.com"

# Node Environment
NODE_ENV="development"
```

**Generate NEXTAUTH_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 4. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with templates
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

### 6. Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

**Note:** The build configuration includes optimizations for Next.js 15 with Turbopack, including proper handling of client-side hooks and Suspense boundaries.

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### POST `/api/auth/verify-email`
Verify user email with token

#### POST `/api/auth/forgot-password`
Request password reset

#### POST `/api/auth/reset-password`
Reset password with token

### Resume Endpoints

#### POST `/api/resumes`
Create new resume

#### GET `/api/resumes`
List user's resumes (with pagination)

#### GET `/api/resumes/[id]`
Get single resume with all sections

#### PUT `/api/resumes/[id]`
Update resume

#### DELETE `/api/resumes/[id]`
Delete resume

### Share Link Endpoints

#### POST `/api/share/[id]`
Generate share link for resume

#### GET `/api/public/[slug]`
Access shared resume (public)

### Template Endpoints

#### GET `/api/templates`
List all templates

---

## ⚠️ Known Issues & Limitations

### UI/UX Issues

1. **Styling Inconsistencies**
   - Component spacing varies across pages
   - Color scheme not fully cohesive
   - Some components lack proper responsive behavior
   - Mobile menu occasionally overlaps content

2. **Editor Experience**
   - On-canvas editing sometimes loses focus
   - Drag-and-drop visual feedback could be smoother
   - Template switching can cause brief layout shifts
   - Hyperlink editing requires manual URL formatting

### Functional Bugs

1. **Auto-Save**
   - Occasionally saves incomplete state
   - Limited visual confirmation of save status

2. **PDF Export**
   - Exported PDF may have minor layout differences from preview
   - Custom fonts might not embed correctly in all browsers
   - Some CSS styles not fully preserved
   - Complex layouts may require manual adjustment

3. **Authentication**
   - Session refresh not fully optimized
   - Google OAuth requires production credentials setup
   - Email server configuration needed for verification emails

4. **State Management**
   - API integration not fully connected in frontend
   - Some state updates require page refresh
   - Template relation removed from Prisma schema (templateId only)

### Performance Issues

1. **Large Resumes**
   - Rendering slows with 10+ sections
   - Auto-save can lag on large documents

2. **Database Queries**
   - Some endpoints lack pagination
   - No query result caching
   - Template relation removed (may require additional queries)

3. **Bundle Size**
   - Large initial JavaScript bundle (~193KB for home page)
   - All templates loaded regardless of usage
   - Code splitting could be improved

### Missing Features

1. **Testing**
   - Limited unit test coverage
   - No integration tests
   - No E2E tests

2. **Production Features**
   - Account deletion
   - Data export (JSON/CSV)
   - Resume analytics
   - Version history

3. **Build Configurations**
   - TypeScript and ESLint errors ignored in production build
   - Some type safety bypassed for deployment speed

---

## 🔮 Future Improvements

### High Priority

1. **UI/UX Refinement**
   - Consistent design system implementation
   - Professional color palette
   - Smooth animations and transitions
   - Mobile-optimized editor
   - Improved hyperlink editing UX

2. **Bug Fixes**
   - Fix all known functional bugs
   - Improve auto-save reliability
   - Stabilize PDF export across browsers
   - Enhance state management consistency
   - Fix TypeScript errors properly (not bypassed)

3. **Testing**
   - Add unit tests (Jest)
   - Integration tests for API
   - E2E tests (Playwright/Cypress)
   - Test coverage > 70%

4. **Performance Optimization**
   - Implement code splitting
   - Add query caching (React Query)
   - Optimize bundle size
   - Lazy load templates
   - Re-add Prisma template relations properly

### Medium Priority

1. **Additional Features**
   - Profile picture upload
   - Resume analytics dashboard
   - ATS (Applicant Tracking System) score
   - Multiple resume versions
   - Resume templates marketplace

2. **Advanced Customization**
   - Custom section types
   - Section-level styling
   - More template options (10+ templates)
   - Import from LinkedIn
   - Rich text editor for descriptions

3. **Export Options**
   - Export to Word (.docx)
   - Export to HTML
   - Export to JSON
   - Print optimization

### Low Priority

1. **AI Features**
   - AI-powered content suggestions
   - Grammar and spell check
   - Resume scoring and tips

2. **Integrations**
   - LinkedIn integration
   - Job board posting
---

## 🎓 Learning Outcomes

### Technical Skills Demonstrated

1. **Full-Stack Development**
   - Next.js App Router mastery
   - RESTful API design
   - Database schema design
   - State management patterns

2. **Modern TypeScript**
   - Advanced type definitions
   - Generic components
   - Type-safe Redux

3. **UI/UX Implementation**
   - Responsive design
   - Component libraries
   - Animation and transitions

### Challenges Overcome

1. **Polymorphic Section Design**
   - Challenge: Flexible section types in single table
   - Solution: JSON data field with type enum

2. **Next.js 15 Compatibility**
   - Challenge: useSearchParams causing static generation errors
   - Solution: Wrapped components in Suspense boundaries

3. **PDF Export**
   - Challenge: Text-based export preserving styles
   - Solution: jsPDF + html2canvas with custom rendering

4. **Single-Page Optimization**
   - Challenge: Auto-fit content to one page
   - Solution: Dynamic font size reduction with visual indicators

5. **Type Safety in Production**
   - Challenge: TypeScript strict mode blocking builds
   - Solution: Fixed Date → ISO string conversions, removed invalid Prisma relations

---

## Contact

**Developer:** Tanish Vijay Rai  
**GitHub:** [@tanish435](https://github.com/tanish435)  
**Repository:** [resume-builder](https://github.com/tanish435/resume-builder)

---

## Recent Updates

### Build Fixes (Latest)
- Fixed TypeScript type errors (Date to ISO string conversions)
- Removed invalid Prisma template relations
- Added Suspense boundaries for Next.js 15 compatibility
- Configured ESLint to allow production builds
- Production build now completes successfully (18/18 pages)

### Feature Additions
- Email verification system
- Password reset flow
- Hyperlink support in sections
- Skills formatting optimization
- Single-page optimization
- Resume switcher
- Page fit indicator

---