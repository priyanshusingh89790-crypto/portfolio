# Priyanshu Singh — GitHub Portfolio Knowledge Base

> **Purpose:** This is the evidence-backed knowledge source for the AI assistant embedded in Priyanshu Singh's portfolio.
>
> **Source:** Public GitHub repositories under `priyanshusingh89790-crypto`.
>
> **Important:** This document distinguishes verified implementation evidence from repository names/metadata and from features that are only planned. The AI must never invent a technology, feature, metric, deployment, job responsibility, or implementation detail that is not supported here.

---

## 1. AI ASSISTANT OPERATING RULES

The assistant represents Priyanshu's work.

### Grounding rules

1. Answer from this knowledge base first.
2. Prefer concrete implementation details over generic skill claims.
3. When a feature is backed by source code, explain **what was implemented and how**.
4. If a feature is only present in a README, describe it as documented rather than claiming source-level verification.
5. If a repository only proves that a technology is installed in `package.json`, do not claim that every feature of that technology was implemented.
6. Do not convert absence of evidence into a negative claim.
7. Do not invent metrics, users, performance numbers, production scale, client adoption, revenue, accuracy, or deployment status.
8. Do not claim backend/server-side pagination when the evidence only proves a frontend request such as `?page=...`.
9. Do not claim production readiness unless the project explicitly documents it and source evidence supports it.
10. When asked about a specific project, mention the repository and concrete implementation evidence.
11. When asked "what skills does Priyanshu have?", prioritize skills demonstrated across multiple repositories.
12. When a question is outside the knowledge base, say that the available project evidence does not contain enough information.
13. The portfolio repository is currently being actively integrated with AI. Do not describe the AI portfolio integration as a completed feature unless explicitly updated in this knowledge base.

### Answer style

- Be concise but technically specific.
- Use natural language, not a raw dump of technologies.
- For technical/interview questions, give implementation examples from the repositories.
- When useful, mention the project where the skill is demonstrated.
- Prefer:
  > "He implemented API-driven pagination in PrimeReactPagination: the page state is sent to the API, total count is consumed from the response, a dynamic page window is calculated, and selection is preserved across pages with a Set of IDs."
- Avoid:
  > "He knows pagination."

---

# 2. ENGINEERING PROFILE

## Primary direction

Priyanshu is a frontend-focused full-stack developer who has built React applications ranging from UI-heavy portfolio experiences to full-stack systems involving authentication, APIs, databases, AI integrations, dashboards, and real-time-style interactions.

## Strongest verified technology areas

### Frontend
- React
- JavaScript / JSX
- TypeScript / TSX
- React Router
- Vite
- Create React App
- Tailwind CSS
- Responsive UI
- Component-based architecture
- Reusable components
- Custom React hooks
- React Context
- Redux Toolkit / React Redux
- Local React state
- Form handling
- Search
- Filtering
- Sorting
- Pagination
- Virtualized lists
- Loading and error states
- Responsive mobile/desktop layouts
- Lucide React / React Icons
- Recharts
- Framer Motion
- GSAP
- GSAP ScrollTrigger
- Lenis smooth scrolling
- Three.js / React Three Fiber / Drei
- Howler audio integration
- EmailJS
- Firebase

### Backend / full stack
- Node.js
- Express
- REST API design
- Axios / Fetch
- MongoDB
- Mongoose
- JWT authentication
- bcrypt / password hashing
- Middleware
- Role-based authorization
- Request validation
- Error middleware
- API contracts
- CRUD systems
- Activity/audit logging
- OTP flow
- Cloudinary uploads
- Environment variables
- CORS

### AI / GenAI
- Google Gemini API
- AI-generated recommendation flows
- Server-side LLM/API integration
- Structured AI outputs
- Zod validation
- AI clarification workflows
- AI-to-structured-experiment workflows
- Deterministic non-AI computation separated from AI interpretation
- TensorFlow.js
- TensorFlow GraphModel loading
- YAMNet-style audio classification
- Browser microphone/audio processing
- Speech recognition
- AI-assisted research prototypes

### Data / visualization
- Recharts
- Dashboard KPI calculations
- Derived metrics
- CSV-based deterministic backtesting
- Synthetic datasets
- Search/filter/sort pipelines
- Data virtualization

### Mobile / device APIs
- React Native
- Expo
- Expo Router
- React Navigation
- Reanimated
- Gesture Handler
- Device Motion API
- Browser microphone access
- Web Speech Recognition

---

# 3. FEATURE-LEVEL SKILL EVIDENCE

These are the implementation-level capabilities that should be surfaced when relevant.

## Pagination

### PrimeReactPagination
Verified implementation:
- React state for current page.
- Fixed page size of 10.
- API request includes `?page=${pageNumber}`.
- Reads `result.data`.
- Reads `result.pagination.total`.
- Calculates total pages.
- Calculates a five-page visible page window.
- Previous/Next controls.
- Disabled navigation states.
- Entry range calculation (`showing X to Y of Z entries`).
- Loading and error state handling.
- PrimeReact DataTable.
- Multi-row selection.
- Selection persistence across pages using a `Set` of row IDs.
- Custom "select first N rows" interaction through an OverlayPanel.

**Important distinction:** this proves an API-driven frontend pagination implementation. It does not by itself prove the backend pagination implementation.

Source: `PrimeReactPagination/src/components/page.tsx`.

---

## Search, filtering and sorting

### Inventory Management System
`Products.tsx` and `useProductsPage.ts` implement:
- Search query state.
- Category filtering.
- Derived `filteredProducts`.
- Add product flow.
- Edit product flow.
- Delete product flow.
- Form open/close state.
- Submit handling.
- Sort direction toggle.
- Reusable `ProductForm`.
- Reusable `ProductTable`.

### Mail Inbox
`useEmails.js` implements:
- Search query state.
- 500ms debounced search.
- Search over subject, sender and message body.
- Memoized filtered results.
- Memoized selected email.
- Email selection state.

---

## Custom React hooks

Verified examples include:
- Inventory: `useAppNavigation`, `useInventory`, `useInventoryState`, `useProductForm`, `useProductsPage`, `useStockMovement`.
- Mail Inbox: `useEmails`, `useDebounce`, `useDarkMode`.
- AI Safety SOS: `useLogin`.
- Portfolio: React hooks for loader state, scroll detection, menu state and lifecycle management.

This is stronger evidence than simply listing "React Hooks" as a technology.

---

## State management

Verified approaches across projects:
- Local `useState` for page/component state.
- React Context for shared application state.
- Redux Toolkit / React Redux in projects such as Netflix GPT and the portfolio.
- `Set` for cross-page row-selection persistence.
- Derived state with `useMemo`.
- Callback stabilization with `useCallback`.
- Refs with `useRef` for persistent mutable values and browser resources.

---

## Responsive UI

Verified across multiple repositories:
- Responsive Tailwind layouts.
- Mobile/desktop conditional rendering.
- Mobile navigation drawers.
- Mobile back-navigation flows.
- Responsive dashboard grids.
- Responsive mail inbox/detail layout.
- React Native / Expo mobile work.

---

# 4. FEATURED PROJECT: NETFLIX GPT

## Overview

A React-based Netflix-style application with an AI movie recommendation flow and a separate Node/Express server.

## Verified stack

- React 19
- React DOM
- React Router DOM
- Redux Toolkit / React Redux
- Tailwind CSS
- Firebase
- Express
- Node.js
- Gemini API
- Fetch
- Lucide React

`package.json` verifies the dependencies above.

## AI implementation

`server/ai/gemini.js` contains a server-side Gemini integration.

Verified behavior:
- Sends a prompt to Google's Gemini `gemini-2.5-flash` endpoint.
- API key is read from `process.env.GEMINI_API_KEY`.
- Requests a list of movie titles.
- Uses a low temperature (`0.1`) and output token limit.
- Parses Gemini response candidates and text parts.
- Splits generated text into movie titles.
- Removes numbered-list prefixes.
- Filters empty lines.
- Collects results and returns the first 10 titles.

## AI backend architecture

`server/index.js`:
- Express server.
- dotenv configuration.
- CORS middleware.
- JSON body parsing.
- `/api/ai` route mounting.
- Port configuration.

`server/routes/ai.js`:
- POST AI endpoint.
- Reads `prompt` from request body.
- Returns HTTP 400 when prompt is missing.
- Calls `aiSuggest(prompt)`.
- Returns `{ text }`.
- Catches AI errors and returns HTTP 500.

## Useful AI skills to surface

- LLM API integration
- Server-side AI orchestration
- Prompt construction
- Response parsing
- Error handling
- Environment-variable API-key management
- Frontend-to-backend AI request flow

## Do not overclaim

The verified AI code proves Gemini integration and recommendation generation. Do not claim a sophisticated RAG system, vector database, embeddings pipeline, agent framework, or production-scale recommendation engine unless additional evidence is added.

---

# 5. FEATURED PROJECT: INVENTORY MANAGEMENT SYSTEM

## Overview

A TypeScript React inventory application organized around pages, reusable components, hooks, context, data, types and utilities.

## Verified stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Project architecture

The source structure contains:
- `components`
- `context`
- `data`
- `hooks`
- `pages`
- `types`
- `utils`

Pages:
- Dashboard
- Products
- Profile
- Stock

## Dashboard

`Dashboard.tsx` calculates:
- Total products.
- Total stock units.
- Low-stock items.
- Inventory value.
- Low-stock watchlist.

It uses:
- `useInventory`
- reusable `SummaryCard`
- `LoadingState`
- formatting utilities
- navigation callbacks
- responsive grid layouts.

## Product management

Verified:
- Search.
- Category filtering.
- Sorting.
- Add product.
- Edit product.
- Delete product.
- Product form.
- Product table.
- Custom page hook.
- Form state management.
- Derived filtered product collection.

## Stock management

`Stock.tsx` / `useStockMovement.ts` implement:
- Product selection.
- Stock-in mode.
- Stock-out mode.
- Quantity input.
- Current stock display.
- Success/error messaging.
- Dynamic stock visualization.
- Product metadata such as category and SKU.

## Architecture skills demonstrated

- TypeScript application structure.
- Feature-specific hooks.
- Component composition.
- Separation of page logic and UI.
- Shared context/state.
- Utility functions.
- Domain-specific state management.

---

# 6. FEATURED PROJECT: SALES CRM

## Overview

A full-stack Customer Relationship Management application.

A project audit document in the repository describes:
- React 19 frontend.
- Vite.
- Tailwind CSS.
- Node.js.
- Express 5.
- MongoDB.
- Mongoose.
- JWT authentication.
- bcryptjs password hashing.
- Mock OTP flow.
- Recharts.
- Axios.
- React Context.

## Backend architecture

Documented structure includes:
- `controllers`
- `middleware`
- `models`
- `routes`
- `utils`
- database configuration.

Controllers include:
- auth
- member
- lead
- contact
- deal
- report
- activity

Middleware includes:
- JWT authentication.
- Active-user verification.
- Role-based access control.
- Validation.
- Pagination validation.
- Global error handling.
- 404 handling.

## Database models

Documented models:
- Member
- Lead
- Contact
- Deal
- ActivityLog
- OTP

## Authentication

Verified/documented:
- JWT bearer authentication.
- Password hashing with bcryptjs.
- Current-user endpoint.
- Login.
- Mock OTP generation and verification.
- OTP hashing with SHA-256.
- OTP expiration.
- OTP attempt limits.
- Active-user checks.

## Authorization

Role-based access includes:
- ADMIN
- AGENT
- USER

Examples include admin-only member creation, admin/agent reporting access and assigned-agent restrictions.

## CRM functionality

Verified/documented:
- Member management.
- Lead management.
- Lead assignment.
- Lead status updates.
- Contact management.
- Deal management.
- Deal stages.
- Dashboard KPIs.
- Reports.
- Revenue summaries.
- Activity logs.
- Search.
- Filtering.
- Pagination.
- CRUD operations.

## API architecture

Documented REST routes include:
- `/api/auth/*`
- `/api/members`
- `/api/leads`
- `/api/contacts`
- `/api/deals`
- `/api/reports/*`
- `/api/dashboard/stats`
- `/api/activity-logs`
- `/api/health`

## Engineering concepts

This project is especially useful for questions about:
- Full-stack architecture.
- REST APIs.
- Authentication.
- Authorization.
- MongoDB schema design.
- Mongoose.
- Middleware.
- Validation.
- Pagination.
- Search/filter APIs.
- Audit logging.
- Dashboard/reporting APIs.
- Frontend API clients.

---

# 7. FEATURED PROJECT: SOCIALPOST / 3W SOCIAL POST APP

## Overview

A full-stack mini social feed application.

## Verified/documented features

- User registration.
- Login.
- JWT authentication.
- Persistent sessions via localStorage.
- Create posts with text/image/both.
- Public feed.
- Newest-first feed ordering.
- Paginated feed.
- Like/unlike toggle.
- Comments.
- Real-time-style UI updates without page reload.
- Usernames on likes/comments.
- Cloudinary image uploads.
- Responsive desktop/tablet/mobile UI.

## Stack

Frontend:
- React 19
- Vite
- React Router v7
- Axios

Backend:
- Node.js
- Express 5
- Mongoose

Database:
- MongoDB Atlas

Auth:
- JWT
- bcryptjs

Images:
- Cloudinary

Deployment documented:
- Vercel frontend.
- Render backend.

## API examples

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/posts?page=1&limit=10`
- `POST /api/posts`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/comments`

This is useful evidence for:
- Full-stack CRUD.
- Authentication.
- Pagination.
- File/image uploads.
- MongoDB.
- REST APIs.
- Protected routes.
- Frontend/backend separation.

---

# 8. FEATURED PROJECT: AI SAFETY SOS

## Overview

A React/Vite safety application combining browser/device APIs, TensorFlow.js audio classification, speech recognition, motion detection and location sharing UI.

## Verified stack

- React
- Vite
- Tailwind CSS
- TensorFlow.js
- TensorFlow.js Converter
- Firebase
- Axios
- React Router
- Leaflet
- React Leaflet
- Google Maps React integration
- Framer Motion
- Lucide React

## Audio AI

`voicedetection.jsx` implements:
- TensorFlow.js initialization.
- Graph model loading from `/model/model.json`.
- YAMNet class-map CSV loading.
- Browser microphone access via `navigator.mediaDevices.getUserMedia`.
- Web Audio `AudioContext`.
- `AnalyserNode`.
- Audio waveform buffering.
- 16,000-sample chunks.
- Tensor creation from waveform data.
- Model execution.
- Score extraction.
- Top-five sound ranking.
- Detection for labels containing terms such as gunshot, explosion, scream, cry, shout and yell.
- Threshold-based danger detection.
- Danger score accumulation.
- Automatic SOS activation after a danger-score threshold.
- Cleanup of microphone tracks and timers.

## Speech recognition

Also uses browser Speech Recognition:
- Continuous recognition.
- Interim results.
- English language configuration.
- Transcript normalization.
- Panic-word matching.
- Automatic restart after recognition ends.
- Error handling.

## Motion / shake detection

`shakedetection.jsx` implements:
- Device Motion API.
- Acceleration including gravity.
- Motion-speed calculation.
- Shake threshold.
- Three detected shakes trigger SOS.
- Permission request when supported.
- Event listener cleanup.

## Location

`Location.jsx` provides:
- Live location UI.
- Map component.
- Start Tracking action.
- Share Location action.
- Location-sharing utility.

## Strong skills demonstrated

- Browser hardware APIs.
- Client-side machine learning.
- Audio processing.
- TensorFlow.js.
- Model loading.
- Real-time-ish event processing.
- Speech recognition.
- Device motion.
- Permission handling.
- Resource cleanup.
- Safety-oriented UI flows.

---

# 9. FEATURED PROJECT: MAIL INBOX TASK

## Overview

A large-data email inbox UI focused on responsive interaction and list performance.

## Verified stack

- React 19
- Vite
- Tailwind CSS
- Lucide React
- `@tanstack/react-virtual`
- `react-window`
- date-fns
- UUID

## Data handling

`useEmails.js` implements:
- Dynamic import of a large `emails.json` dataset.
- Loading state.
- Selected-email state.
- Search state.
- Debounced search.
- Memoized filtering.
- Memoized selected email.
- New-message simulation using a timed interval.
- Marking selected email as no longer new.
- Cleanup of the interval.

## Search

Searches:
- Subject.
- Sender.
- Message body.

Uses a 500ms debounce.

## Virtualized list

`MailList.jsx` uses TanStack Virtual:
- Virtual row calculation.
- Scroll-element reference.
- Estimated row size.
- Overscan.
- Total virtualized list height.
- Rendering only virtual rows.
- Memoized `MailList` component.

## Responsive behavior

`App.jsx` implements:
- Desktop split inbox/detail layout.
- Mobile single-panel behavior.
- Mobile back-to-inbox control.
- Dark mode.
- Loading state.
- Empty state.
- Search.
- Selected email state.

## Strong skills demonstrated

- Performance-aware React.
- List virtualization.
- Large-data UI handling.
- Debouncing.
- Memoization.
- Custom hooks.
- Responsive layout.
- Dark mode.
- Component memoization.

---

# 10. FEATURED PROJECT: BRAND / PREMIUM WEBSITE

Repository: `brand-project`

## Verified structure

The project contains:
- Header.
- Front page.
- About.
- Story.
- Cards.
- Contact.
- Reservation table.
- Feedback section.
- Footer.

## Stack

- React 19
- React Router
- Vite
- Tailwind CSS
- PostCSS
- Prettier / Tailwind formatting tooling.

## Feedback system

`Feedback.jsx` demonstrates:
- Controlled form inputs.
- Rating state.
- Review state.
- Name/email state.
- Local review collection.
- Validation (`rating` required and review length).
- New review insertion.
- Average rating calculation.
- Total review count.
- Rating distribution UI.
- Recommendation toggle.
- Recent review rendering.
- Responsive layout.

## Useful skills

- Form state.
- Client-side validation.
- Rating UI.
- Derived metrics.
- Interactive toggles.
- Component decomposition.
- Responsive visual design.

---

# 11. FEATURED PROJECT: PRIME REACT PAGINATION

Repository: `PrimeReactPagination`

## Verified technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- PrimeReact
- PrimeReact DataTable
- PrimeReact Column
- PrimeReact OverlayPanel

## Verified implementation

- API data loading.
- Pagination.
- Page state.
- Total-count handling.
- Page-window calculation.
- Previous/Next.
- Disabled states.
- Loading/error handling.
- Multi-row selection.
- Selection persistence across pages.
- Custom row selection by count.
- Derived entry-range calculations.
- Typed React state.

---

# 12. CURRENT PORTFOLIO — SEPARATE SNAPSHOT

> This section is intentionally separated because the portfolio itself is currently being extended with AI.

Repository: `portfolio`

## Current verified stack

- React 19
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- React Redux
- GSAP
- GSAP React
- GSAP ScrollTrigger
- Lenis
- Motion
- Three.js
- React Three Fiber
- Drei
- Howler
- Lucide React
- EmailJS

## Current application structure

The current `App.jsx` contains:
- Loader.
- Custom cursor.
- Smart header.
- Hero.
- About.
- Projects.
- Skills.
- Scroll video section.
- Experience.
- Contact.
- Audio player.
- Theme toggle.

## Navigation

The current header tracks:
- Home
- About
- Projects
- Skills
- Video
- Experience
- Contact

It detects the active section based on scroll position and changes header contrast depending on whether the current section is light or dark.

## Current interaction system

Verified:
- Smooth scrolling using Lenis.
- GSAP ticker integration with Lenis.
- GSAP ScrollTrigger registration.
- Fixed smart header.
- Scroll-based active section detection.
- Responsive desktop/mobile navigation.
- Mobile menu drawer.
- Custom cursor component.
- Loader gate before the main portfolio is displayed.
- Audio event triggered after loader completion.
- Theme toggle.

## Visual/creative engineering direction

The portfolio is not a generic static portfolio. Its current architecture already supports:
- cinematic transitions,
- scroll-driven interactions,
- custom cursor behavior,
- audio,
- theme-aware navigation,
- smooth scrolling,
- GSAP-based motion,
- 3D capability through Three.js / React Three Fiber.

## AI integration status

The AI portfolio integration is an active work-in-progress and is not treated as completed in this knowledge base.

The intended AI experience is a custom visual interaction integrated into the portfolio rather than a generic chatbot widget.

---

# 13. AI TRADING RESEARCH ASSISTANT

Repository: `AI-TRADING-RESEARCH`

## Overview

An internship prototype for turning an ambiguous natural-language market question into a structured experiment, running a deterministic backtest on synthetic data, and explaining the resulting evidence.

Primary demo question:
> "Does buying NIFTY after a sharp fall work?"

## Workflow

`ASK → CLARIFY → DEFINE → TEST → LEARN`

### ASK
Natural-language market research question.

### CLARIFY
AI identifies:
- User-provided information.
- Inferred information.
- Missing information.

Clarification questions are generated when required.

### DEFINE
AI creates a structured `Experiment` object.

### TEST
A deterministic TypeScript engine runs the experiment against a local synthetic CSV dataset.

### LEARN
AI receives the exact numerical results and interprets them without changing them.

## Architecture

- React
- Tailwind CSS
- Next.js App Router
- TypeScript
- Zod
- Google Gemini
- Synthetic CSV data
- Deterministic TypeScript backtest engine.

## Important engineering decisions

- AI does not calculate the backtest statistics.
- Same inputs produce deterministic outputs.
- Assumptions are visible and editable.
- No silent fallback for unsupported thresholds/timings.
- Non-overlapping trades.
- Daily timeframe only.
- Unsupported filters are rejected.
- Synthetic data is clearly labeled.
- NIFTY index results are not presented as directly tradable performance.

## Strong skills demonstrated

- Structured AI workflows.
- Schema validation with Zod.
- AI clarification.
- AI-to-structured-data conversion.
- Deterministic business logic separated from AI.
- Experiment design.
- Backtesting logic.
- Explicit assumptions.
- Error/unsupported-case handling.
- Evidence-based AI interpretation.

---

# 14. OTHER VERIFIED / IDENTIFIABLE REPOSITORIES

The GitHub account currently contains the following repositories. Repository presence/name is verified, but the AI must not invent detailed functionality for repositories whose implementation evidence is not included in the sections above.

## Engineering / application repositories

- `netflix-gpt`
- `Dev-meetup`
- `inventory-management-system`
- `sales_CRM`
- `3w-social-post-app`
- `brand-project`
- `PrimeReactPagination`
- `Mail-Inbox-Task`
- `portfolio`

## AI / experimental repositories

- `AI-TRADING-RESEARCH`
- `ai-safety-sos`
- `Ai-workspace`
- `Ai-integration`
- `ai-recruiter`
- `ARCHSCALE-VOICE_ASSISTANT`
- `cinegrapgh`

## Assignments / application exercises

- `taskmanagement`
- `aps-assignment`
- `Educase-assignment`
- `codesfortomorrow--task`
- `Figma-design`
- `zoryvn-assignment-FinanceDashboard`
- `ADORE-assignment`
- `Eva-bharat-assignment-`
- `SuperCode-assignment`
- `koinx-assignment`
- `multi-category-product-assignment`
- `reactnative-task-cogniqAi`

## Practice / infrastructure / miscellaneous

- `react-`
- `ansibleproject`
- `just`
- `Itzzfizz-animation`

---

# 15. VERIFIED PROJECT-TO-SKILL MAP

| Skill / Capability | Evidence |
|---|---|
| React | Netflix GPT, Dev Meetup, Inventory, Mail Inbox, CRM, SocialPost, Portfolio |
| TypeScript | Inventory, PrimeReactPagination, AI Trading |
| React Router | Dev Meetup, Netflix GPT, AI Safety, SocialPost |
| Vite | Dev Meetup, Inventory, AI Safety, Mail Inbox, SocialPost, Portfolio |
| Tailwind CSS | Inventory, Dev Meetup, Mail Inbox, AI Safety, Portfolio, CRM |
| Redux Toolkit | Netflix GPT, Portfolio |
| React Context | Sales CRM, SocialPost |
| Custom Hooks | Inventory, Mail Inbox, AI Safety, Portfolio |
| API integration | Netflix GPT, CRM, SocialPost, PrimeReactPagination |
| REST APIs | CRM, SocialPost, Netflix GPT |
| Authentication | CRM, SocialPost, Netflix GPT/Firebase-related app flows |
| JWT | CRM, SocialPost |
| bcrypt/password hashing | CRM, SocialPost |
| Role-based access | CRM |
| MongoDB/Mongoose | CRM, SocialPost |
| CRUD | Inventory, CRM, SocialPost |
| Search | Inventory, CRM, Mail Inbox |
| Filtering | Inventory, CRM, Mail Inbox |
| Sorting | Inventory, PrimeReactPagination |
| Pagination | PrimeReactPagination, CRM, SocialPost |
| Virtualized lists | Mail Inbox |
| Debouncing | Mail Inbox |
| Memoization | Mail Inbox |
| Loading/error states | PrimeReactPagination, Inventory, Mail Inbox, Netflix GPT |
| Responsive UI | Inventory, Mail Inbox, SocialPost, Dev Meetup, AI Safety, Portfolio |
| Recharts | CRM, Finance Dashboard dependency evidence |
| GSAP | Portfolio |
| ScrollTrigger | Portfolio |
| Lenis | Portfolio |
| Three.js | Portfolio dependency evidence |
| React Three Fiber | Portfolio dependency evidence |
| Framer Motion | AI Safety |
| Firebase | Netflix GPT, AI Safety |
| Gemini API | Netflix GPT, AI Trading |
| TensorFlow.js | AI Safety |
| Browser Speech Recognition | AI Safety |
| Web Audio API | AI Safety |
| Device Motion API | AI Safety |
| Cloudinary | SocialPost |
| Axios | CRM, SocialPost, AI Safety |
| EmailJS | Portfolio |
| Audio integration | Portfolio / Howler dependency |
| Dashboard/KPIs | Inventory, CRM |
| Audit logging | CRM |
| OTP flow | CRM |
| Zod | AI Trading |
| Deterministic backtesting | AI Trading |
| Synthetic datasets | AI Trading |
| AI clarification workflow | AI Trading |
| Structured AI outputs | AI Trading |
| Performance optimization | Mail Inbox virtualization, memoization/debouncing |
| Mobile development | React Native/Expo repository |
| Expo Router | React Native task |
| React Native Reanimated | React Native task |
| Device permission handling | AI Safety |

---

# 16. HOW TO ANSWER COMMON QUESTIONS

## "What are Priyanshu's strongest skills?"

Mention the combination of:
- React frontend engineering.
- TypeScript.
- Component architecture.
- Custom hooks.
- State management.
- API integration.
- Authentication.
- Full-stack Node/Express/MongoDB.
- Responsive UI.
- Pagination/search/filtering/sorting.
- Performance-aware interfaces.
- AI integrations with Gemini and TensorFlow.js.
- Animation-heavy portfolio engineering with GSAP/Lenis/Three.js.

Do not present this as a ranking. These are recurring capabilities evidenced across projects.

## "Has Priyanshu implemented pagination?"

Yes.

Give examples:
1. PrimeReactPagination — explicit API-driven pagination, page window, previous/next, total counts, selection persistence.
2. SocialPost — documented paginated feed API.
3. Sales CRM — documented pagination on members, contacts, deals and activity logs.

## "Has Priyanshu worked with AI?"

Yes.

Concrete examples:
- Netflix GPT — Gemini API movie recommendation flow through a Node/Express backend.
- AI Safety SOS — TensorFlow.js audio model + browser speech recognition + device motion.
- AI Trading Research — Gemini-based clarification/experiment workflow combined with a deterministic TypeScript backtest engine.
- Other AI-related repositories exist, but only describe their detailed functionality when evidence is added.

## "Has Priyanshu built backend systems?"

Yes.

Strongest evidence:
- Sales CRM: Node/Express/MongoDB/Mongoose/JWT/bcrypt/middleware/roles/API routes.
- SocialPost: Node/Express/MongoDB/JWT/bcrypt/Cloudinary.
- Netflix GPT: Node/Express AI backend.

## "Does he know performance optimization?"

Evidence includes:
- Mail Inbox virtualization using TanStack Virtual.
- Debounced search.
- `useMemo`.
- `useCallback`.
- `React.memo`.
- Overscan configuration.
- Portfolio Lenis + GSAP ticker integration.
- Lazy/conditional UI rendering patterns.

Do not invent benchmark numbers.

## "What makes the portfolio technically interesting?"

The current portfolio uses:
- GSAP.
- ScrollTrigger.
- Lenis.
- custom cursor.
- audio.
- theme-aware navigation.
- loader gating.
- responsive navigation.
- Three.js / React Three Fiber dependencies.
- motion libraries.

The AI layer is being added separately and should not be described as already complete.

---

# 17. IMPORTANT LIMITATIONS / DO-NOT-CLAIM LIST

Unless new evidence is added, do **not** claim:

- Specific performance percentages.
- Specific user counts.
- Production traffic.
- Revenue generated.
- Client/company adoption.
- Paid users.
- Large-scale infrastructure.
- Kubernetes.
- Docker production deployment.
- CI/CD ownership.
- Automated testing coverage.
- Server-side pagination implementation for PrimeReactPagination.
- RAG/vector database implementation.
- Fine-tuned LLMs.
- AI agents with tool calling.
- Production ML model training.
- Real-world safety effectiveness of AI Safety SOS.
- Real trading performance from AI Trading Research.
- Real NIFTY performance from the synthetic dataset.
- Any feature listed as a future improvement in a README as if it already exists.

---

# 18. SOURCE EVIDENCE MAP

Primary source paths used during the audit:

### Netflix GPT
- `package.json`
- `server/index.js`
- `server/routes/ai.js`
- `server/ai/gemini.js`
- `README.md`

### Dev Meetup
- `package.json`
- `src/main.jsx`
- `src/components/Eventscard.jsx`

### Inventory
- `package.json`
- `src/pages/Dashboard.tsx`
- `src/pages/Products.tsx`
- `src/pages/Stock.tsx`
- `src/hooks/useProductsPage.ts`
- `src/hooks/useStockMovement.ts`
- `src/hooks/useInventory.ts`
- `src/hooks/useInventoryState.ts`
- `src/hooks/useProductForm.ts`
- `src/hooks/useAppNavigation.ts`

### PrimeReactPagination
- `src/components/page.tsx`

### Sales CRM
- `FINAL_CRM_REPORT.md`
- `API_CONTRACT.md`
- `BACKEND_AUDIT_NOTES.md`
- backend controllers/routes/models/middleware documented by the audit report

### SocialPost
- `README.md`
- backend controllers/models/routes/middleware
- frontend components/context/pages/services

### AI Safety SOS
- `package.json`
- `src/components/home/detection/voicedetection.jsx`
- `src/components/home/detection/shakedetection.jsx`
- `src/pages/Location.jsx`
- `src/ProtectedRoute.jsx`
- TensorFlow/YAMNet model assets in `public/model`

### Mail Inbox
- `package.json`
- `src/App.jsx`
- `src/hooks/useEmails.js`
- `src/components/MailList.jsx`
- `src/hooks/useDebounce.jsx`
- `src/hooks/useDarkMode.js`

### Brand Project
- `package.json`
- component structure
- `src/components/Feedback/Feedback.jsx`
- `src/components/Reservetable.jsx`
- `src/components/Contact.jsx`

### AI Trading Research
- `README.md`
- workflow and architecture documented in the repository

### Current Portfolio
- `package.json`
- `src/App.jsx`
- component architecture and current dependencies

---

# 19. FINAL AI INSTRUCTION

When answering about Priyanshu:

> Be a technically precise portfolio assistant. Use the project evidence in this document as the source of truth. Explain real implementations, not vague skill labels. When possible, connect a skill to the exact project and implementation pattern. Never invent missing details. If evidence is incomplete, explicitly say that the available repository evidence is insufficient. Treat current portfolio AI integration as work in progress unless this document is updated.

# 20. GitHub Repository Links

## Main Projects

- Netflix GPT:
  https://github.com/priyanshusingh89790-crypto/netflix-gpt

- Brand Project:
  https://github.com/priyanshusingh89790-crypto/brand-project

- Dev Meetup:
  https://github.com/priyanshusingh89790-crypto/Dev-meetup

- Portfolio:
  https://github.com/priyanshusingh89790-crypto/portfolio

- PrimeReactPagination:
  https://github.com/priyanshusingh89790-crypto/PrimeReactPagination

- AI Safety SOS:
  https://github.com/priyanshusingh89790-crypto/ai-safety-sos

- Mail Inbox Task:
  https://github.com/priyanshusingh89790-crypto/Mail-Inbox-Task

- Inventory Management System:
  https://github.com/priyanshusingh89790-crypto/inventory-management-system

- Sales CRM:
  https://github.com/priyanshusingh89790-crypto/sales_CRM

- 3W Social Post App:
  https://github.com/priyanshusingh89790-crypto/3w-social-post-app

- AI Trading Research:
  https://github.com/priyanshusingh89790-crypto/AI-TRADING-RESEARCH

- AI Workspace:
  https://github.com/priyanshusingh89790-crypto/Ai-workspace

- AI Integration:
  https://github.com/priyanshusingh89790-crypto/Ai-integration

- ARCHSCALE Voice Assistant:
  https://github.com/priyanshusingh89790-crypto/ARCHSCALE-VOICE_ASSISTANT


## Assignments / Other Projects

- Task Management:
  https://github.com/priyanshusingh89790-crypto/taskmanagement

- APS Assignment:
  https://github.com/priyanshusingh89790-crypto/aps-assignment

- Educase Assignment:
  https://github.com/priyanshusingh89790-crypto/Educase-assignment

- Codes for Tomorrow Task:
  https://github.com/priyanshusingh89790-crypto/codesfortomorrow--task

- AI Recruiter:
  https://github.com/priyanshusingh89790-crypto/ai-recruiter

- Itzzfizz Animation:
  https://github.com/priyanshusingh89790-crypto/Itzzfizz-animation

- Figma Design:
  https://github.com/priyanshusingh89790-crypto/Figma-design

- Zoryvn Finance Dashboard:
  https://github.com/priyanshusingh89790-crypto/zoryvn-assignment-FinanceDashboard

- ADORE Assignment:
  https://github.com/priyanshusingh89790-crypto/ADORE-assignment

- Eva Bharat Assignment:
  https://github.com/priyanshusingh89790-crypto/Eva-bharat-assignment-

- SuperCode Assignment:
  https://github.com/priyanshusingh89790-crypto/SuperCode-assignment

- Koinx Assignment:
  https://github.com/priyanshusingh89790-crypto/koinx-assignment

- React Native CogniqAI Task:
  https://github.com/priyanshusingh89790-crypto/reactnative-task-cogniqAi

- Multi Category Product Assignment:
  https://github.com/priyanshusingh89790-crypto/multi-category-product-assignment

- Cinegrapgh:
  https://github.com/priyanshusingh89790-crypto/cinegrapgh


## Other Repositories

- React:
  https://github.com/priyanshusingh89790-crypto/react-

- Just:
  https://github.com/priyanshusingh89790-crypto/just

- Ansible Project:
  https://github.com/priyanshusingh89790-crypto/ansibleproject