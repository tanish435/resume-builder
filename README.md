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
- Auth middleware helpers

**Phase 11: UI/UX Polish (Hours 9-12)**
- Toast notification system
- Loading states and skeletons
- Empty state components
- Responsive layouts (mobile, tablet, desktop)
- Hover effects and animations
- Touch-friendly controls

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
│   │   │   │   └── signup/        # User registration
│   │   │   ├── resumes/           # Resume CRUD
│   │   │   ├── share/             # Share link generation
│   │   │   ├── public/            # Public resume access
│   │   │   └── templates/         # Template listing
│   │   ├── auth/                  # Auth pages (signin, signup)
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
│   │   │   ├── HistoryControls.tsx
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
│   │       ├── Loading.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Tooltip.tsx
│   │       ├── Button.tsx
│   │       ├── Form.tsx
│   │       ├── Card.tsx
│   │       └── ResponsiveLayout.tsx
│   ├── hooks/
│   │   ├── useHistory.ts          # Undo/redo hook
│   │   ├── useToast.ts            # Toast notifications
│   │   └── useTemplateTransition.ts
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client
│   │   ├── auth.ts                # NextAuth config
│   │   ├── authHelpers.ts         # Auth middleware
│   │   ├── pdfExport.ts           # PDF generation
│   │   ├── shareUtils.ts          # Share link utils
│   │   ├── templates.ts           # Template definitions
│   │   └── themes.ts              # Theme presets
│   ├── store/                     # Redux store
│   │   ├── index.ts               # Store configuration
│   │   ├── hooks.ts               # Typed hooks
│   │   ├── Provider.tsx           # Redux provider
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── apiSyncMiddleware.ts
│   │   │   ├── autoSaveMiddleware.ts
│   │   │   └── historyMiddleware.ts
│   │   └── slices/                # State slices
│   │       ├── resumeSlice.ts
│   │       ├── editorSlice.ts
│   │       ├── styleSlice.ts
│   │       ├── templateSlice.ts
│   │       ├── historySlice.ts
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

**Components:**
- `EditableContent.tsx` - Handles inline editing
- `SectionWrapper.tsx` - Wraps each section with edit controls
- `ResumeCanvas.tsx` - Main canvas for resume display

### 2. ✅ Design Customization
- **Color customization** (primary color picker)
- **Font selection** (10+ professional fonts)
- **Font size control** (12-18px range)
- **Line height adjustment**
- **Spacing controls** (compact, normal, relaxed)
- **Border styling** (width, radius, color)
- **Theme presets** (Professional, Creative, Minimal, Bold)

**Components:**
- `StyleCustomizer.tsx` - Style control panel
- `ColorPicker.tsx` - Color selection
- `FontSelector.tsx` - Font chooser
- `BorderStyler.tsx` - Border controls
- `SpacingControls.tsx` - Spacing adjustments
- `ThemePresets.tsx` - Pre-made themes

### 3. ✅ Template Switching
- **6 professional templates:**
  - Modern - Clean two-column design
  - Professional - Traditional single-column
  - Creative - Bold with accent colors
  - Minimal - Simple and elegant
  - Compact - Space-efficient
  - Base - Classic layout
- **Instant preview** on hover
- **Smooth transitions** between templates

### 4. ✅ Undo-Redo Stack
- **Full history tracking** of all resume changes
- **Undo** (Ctrl+Z / Cmd+Z)
- **Redo** (Ctrl+Y / Cmd+Shift+Z)
- **Configurable history limit** (50 states default)
- **Debounced state capture** (1000ms)

### 5. ✅ PDF Export
- **Text-based PDF** (not image snapshots)
- **High-quality export** with preserved formatting
- **Custom filename** support
- **Maintains styles** and layout

### 6. ✅ Section Reordering
- **Drag-and-drop** functionality using @dnd-kit
- **Visual feedback** during dragging
- **Instant reordering** with smooth animations

### 7. ✅ Public Sharing
- **Unique shareable links** (e.g., `/share/abc123xyz`)
- **Optional password protection**
- **Expiration dates** (1-365 days)
- **View count tracking**
- **Active/inactive status** toggle

### 8. ✅ User Authentication
- **NextAuth.js integration**
- **Credentials provider** (email/username + password)
- **Google OAuth** support
- **Password hashing** with bcryptjs
- **Protected routes** with middleware

### 9. ✅ Additional Features
- **Auto-save** every 3 seconds
- **Responsive design** (mobile, tablet, desktop)
- **Toast notifications**
- **Loading states**
- **Empty states**
- **40+ reusable UI components**

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

### Functional Bugs

1. **Auto-Save**
    - Occasionally saves incomplete state
    - No visual confirmation of save status

2. **PDF Export**
    - Exported PDF may have minor layout differences
    - Custom fonts might not embed correctly
    - Some CSS styles not fully preserved

3. **Authentication**
    - Session refresh not implemented
    - Google OAuth needs production setup
    - Password reset flow missing
    - Email verification not implemented

4. **Undo/Redo**
    - History can become bloated with rapid changes
    - Some state changes not captured

5. **API Integration**
    - API not integrated properly in the frontend

### Performance Issues

1. **Large Resumes**
   - Rendering slows with 10+ sections
   - Auto-save can lag on large documents

2. **Database Queries**
   - Some endpoints lack pagination
   - No query result caching

3. **Bundle Size**
   - Large initial JavaScript bundle
   - All templates loaded regardless of usage
   - No code splitting for routes

### Missing Features

1. **Testing**
   - Limited unit test coverage
   - No integration tests
   - No E2E tests

2. **Production Features**
   - Email verification
   - Password reset
   - Account deletion
   - Data export

---

## 🔮 Future Improvements

### High Priority

1. **UI/UX Refinement**
   - Consistent design system implementation
   - Professional color palette
   - Smooth animations and transitions
   - Mobile-optimized editor

2. **Bug Fixes**
   - Fix all known functional bugs
   - Improve auto-save reliability
   - Stabilize PDF export
   - Enhance undo/redo robustness

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

### Medium Priority

1. **Additional Features**
   - Email verification
   - Password reset flow
   - Profile picture upload
   - Resume analytics dashboard
   - ATS (Applicant Tracking System) score

2. **Advanced Customization**
   - Custom section types
   - Section-level styling
   - More template options (10+ templates)
   - Import from LinkedIn

3. **Export Options**
   - Export to Word (.docx)
   - Export to HTML
   - Export to JSON

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

2. **Undo/Redo Implementation**
   - Challenge: Efficient state history management
   - Solution: Redux middleware with debounced capture

3. **PDF Export**
   - Challenge: Text-based export preserving styles
   - Solution: jsPDF + html2canvas with custom rendering

---

## 📧 Contact

**Developer:** Tanish Vijay Rai  
**GitHub:** [@tanish435](https://github.com/tanish435)  
**Repository:** [resume-builder](https://github.com/tanish435/resume-builder)

---