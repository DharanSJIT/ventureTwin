# VentureTwin AI

## Overview
Build an intelligent AI Operating System that becomes another version of the user. It is a stateful platform offering a personalized dashboard, project management, career guidance, startup studio, and persistent AI memory.

## Project Type
WEB

## Success Criteria
- Monorepo structure properly instantiated.
- Backend and frontend services communicate efficiently.
- Supabase Auth, DB, and Vector integrations configured.
- White and blue UI without gradients is achieved.
- All AI memory updates run without data staleness.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: Supabase (PostgreSQL, pgvector, Auth, Storage).
- **AI**: OpenAI, LangChain.

## File Structure
```
VentureTwin/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/
```

## Task Breakdown

### 1. Project Initialization & Architecture Setup
- **task_id**: init_project
- **name**: Setup Monorepo and basic scaffolding
- **agent**: orchestrator
- **skills**: app-builder, bash-linux
- **priority**: P0
- **dependencies**: None
- **INPUT**: Run Vite creation and Node.js setup
- **OUTPUT**: `frontend` and `backend` directories with `package.json` and basic typescript configs.
- **VERIFY**: `npm install` and basic dev servers run on both sides.

### 2. Database Schema & Supabase Configuration
- **task_id**: db_schema
- **name**: Design Postgres Schema for VentureTwin
- **agent**: database-architect
- **skills**: database-design
- **priority**: P0
- **dependencies**: init_project
- **INPUT**: Define tables for Users, Profiles, Projects, Tasks, Memory.
- **OUTPUT**: SQL migration files defining normalized schema + pgvector table.
- **VERIFY**: Schema imports successfully into local Supabase or passes validation.

### 3. Frontend Core UI & Design System
- **task_id**: core_ui
- **name**: Implement Design System and Layouts
- **agent**: frontend-specialist
- **skills**: frontend-design, tailwind-patterns
- **priority**: P2
- **dependencies**: init_project
- **INPUT**: Setup Tailwind CSS with primary blue (`#2563EB`) and white backgrounds (no gradients). Install shadcn/ui.
- **OUTPUT**: `Sidebar`, `Navbar`, and `DashboardLayout` components.
- **VERIFY**: Run frontend and visually confirm layout follows the design system rules.

### 4. Authentication Integration
- **task_id**: auth_setup
- **name**: Implement Supabase Auth
- **agent**: security-auditor
- **skills**: react-best-practices
- **priority**: P1
- **dependencies**: core_ui, db_schema
- **INPUT**: Configure Supabase Auth context in React and verification middleware in Express.
- **OUTPUT**: Login, Register pages, and protected routes.
- **VERIFY**: User can sign up, login, and access protected Dashboard.

### 5. Multi-Agent AI System Setup
- **task_id**: ai_setup
- **name**: Initialize AI Services & Memory Layer
- **agent**: backend-specialist
- **skills**: python-patterns / nodejs-best-practices
- **priority**: P1
- **dependencies**: db_schema
- **INPUT**: Integrate LangChain with OpenAI and Supabase pgvector.
- **OUTPUT**: Vector search service and floating AI assistant endpoint.
- **VERIFY**: Basic question answering with memory retrieval works via API.

## ✅ PHASE X COMPLETE
- Lint: [ ] Pass
- Security: [ ] No critical issues
- Build: [ ] Success
- Date: TBD
