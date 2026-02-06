# AI Comic Generator Architecture

## Overview
The AI Comic Generator is a full-stack application that leverages advanced AI models to generate comic scripts and images from simple text ideas. It features a sophisticated Multi-Agent system for iterative refinement.

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons, Shadcn/UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (better-sqlite3)
- **AI Models**: 
  - Gemini 2.0 Flash (Scripting & Thinking)
  - Gemini 3 Pro Image Preview (Image Generation)

## Core Components

### 1. Multi-Agent System (Director & Critic)
- **Director Agent**: Responsible for creative writing, panel planning, and character design.
- **Critic Agent**: Evaluates the director's work based on character consistency, visual impact, and narrative flow.
- **Orchestrator**: Manages the iterative loop between the Director and Critic.

### 2. Image Generation Pipeline
- **Character Consistency**: Generates a master character reference first.
- **Panel Generation**: Uses the character reference and panel description to maintain consistency.
- **Post-Processing**: (Planned) Adding speech bubbles and comic effects.

### 3. State Management & Real-time Updates
- **Server-Sent Events (SSE)**: Streams the AI's thinking process and progress to the frontend in real-time.
- **Task Status API**: Allows the frontend to poll or subscribe to long-running generation tasks.

## Data Flow
1. User submits an idea.
2. Director Agent creates an initial script.
3. Critic Agent reviews and provides scores/feedback.
4. Director Agent refines the script (up to 3 iterations).
5. Once target score is reached, Image Service generates panels.
6. Final results are saved to SQLite and served to the frontend.
