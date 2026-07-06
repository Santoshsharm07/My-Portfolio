# PROJECT_SPEC.md — Portfolio Platform

> A world-class, CMS-driven portfolio platform inspired by Antigravity, Snitch, Cuberto, Apple, Linear, and Awwwards winners.

## 1. Vision
Premium dark-luxury portfolio with an interactive 3D hero, cinematic scroll storytelling, and a fully dynamic admin CMS. Every piece of public content is editable from `/admin`. The experience must feel human-designed and hand-crafted — not templated or "AI-looking".

## 2. Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP (+ ScrollTrigger), Framer Motion |
| 3D | Three.js, React Three Fiber, @react-three/drei |
| Smooth scroll | Lenis |
| Backend/API | Node.js, Express.js (dedicated API) + Next.js Route Handlers |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (media, resume, certificates) |
| Auth (admin) | Username/password from ENV, session/JWT |

## 3. Public Portfolio Sections
Hero · About · Experience · Projects · Case Studies · Skills · Certifications · Resume · Testimonials · Contact

## 4. Admin Panel (`/admin`)
- Login with username/password from ENV.
- Fully dynamic CMS controlling all public content.
- Features: Projects CRUD · Skills CRUD · Experience CRUD · Resume Upload · Certificates CRUD · Testimonials CRUD · SEO Management · Contact Messages · Media Library.

## 5. Design Language
Premium dark luxury aesthetic · Interactive 3D hero · Cinematic animations · Scroll storytelling · Magnetic buttons · Antigravity-inspired interactions · Human-designed feel.

## 6. Deliverables (design-first, no code until approved)
1. Complete architecture
2. Folder structure
3. Database schema
4. API architecture
5. Admin CMS architecture
6. Design system
7. Implementation roadmap
