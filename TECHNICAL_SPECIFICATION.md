# ShootX - Technical Specification Document
**For ComfyUI Developers, API Developers, and Integration Teams**

Version: 2.0
Date: November 2024
Status: Production-Ready Frontend | Backend Integration Required

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Specifications](#api-specifications)
7. [ComfyUI Workflow Requirements](#comfyui-workflow-requirements)
8. [Frontend Integration Points](#frontend-integration-points)
9. [Security & Authentication](#security--authentication)
10. [Deployment Architecture](#deployment-architecture)
11. [Development Workflow](#development-workflow)
12. [Testing Requirements](#testing-requirements)
13. [Performance Requirements](#performance-requirements)
14. [Monitoring & Logging](#monitoring--logging)
15. [Environment Configuration](#environment-configuration)

---

## Executive Summary

ShootX is a **production-ready AI visual content generation platform** that enables users to create, edit, and transform images using 10 specialized AI workflows powered by ComfyUI on RunPod infrastructure.

### Current Status
- ✅ **Frontend**: 100% complete, production-ready
- ✅ **Database Schema**: Designed and deployed
- ✅ **UI/UX**: Fully responsive, dark/light themes
- ✅ **Authentication**: Supabase Auth integrated
- 🔄 **Backend API**: Requires implementation
- 🔄 **ComfyUI Workflows**: Require development and deployment
- 🔄 **RunPod Integration**: Requires setup

### Key Metrics
- **Frontend Bundle**: 476.56 kB JS, 57.17 kB CSS (gzipped: 113.17 kB, 9.01 kB)
- **Load Time**: < 2 seconds
- **Workflows**: 10 specialized AI workflows
- **Database Tables**: 12 core tables
- **API Endpoints**: 15+ required endpoints

---

## Project Overview

### Purpose
Democratize AI-powered visual content generation for e-commerce brands, marketers, and content creators without requiring technical expertise.

### Target Users
- E-commerce brands (product photography)
- Digital marketers (social media content)
- Content creators (visual assets)
- Design agencies (client deliverables)

### Business Model
- **Credit-based system**: Pay per generation
- **Subscription tiers**: Different credit allocations
- **Enterprise plans**: Custom pricing and features

---

## System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite + TypeScript + Tailwind)          │   │
│  │  - 7 Main Modules                                        │   │
│  │  - 10 Workflow Interfaces                               │   │
│  │  - Real-time Status Updates                             │   │
│  │  - Image Gallery & History                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ▼                                    │
└──────────────────────────────────────────────────────────────────┘
                               │
                    HTTPS / WebSocket
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Backend API Service (Node.js / Python / Go)             │  │
│  │  - Authentication & Authorization                         │  │
│  │  - Credit Management                                      │  │
│  │  - Job Queue Management                                   │  │
│  │  - Webhook Handling                                       │  │
│  │  - Image Processing & Storage                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ▼                                    │
└──────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│  SUPABASE LAYER            │  │  COMPUTE LAYER             │
│                            │  │                            │
│  ┌──────────────────────┐ │  │  ┌──────────────────────┐ │
│  │ PostgreSQL Database  │ │  │  │ RunPod Serverless    │ │
│  │ - User data          │ │  │  │ - GPU instances      │ │
│  │ - Generations        │ │  │  │ - ComfyUI runtime    │ │
│  │ - Projects           │ │  │  │ - Model storage      │ │
│  │ - Billing            │ │  │  │ - Workflow execution │ │
│  └──────────────────────┘ │  │  └──────────────────────┘ │
│                            │  │                            │
│  ┌──────────────────────┐ │  │  ┌──────────────────────┐ │
│  │ Auth Service         │ │  │  │ Image Storage (S3)   │ │
│  │ - JWT tokens         │ │  │  │ - Input images       │ │
│  │ - Session mgmt       │ │  │  │ - Output images      │ │
│  └──────────────────────┘ │  │  └──────────────────────┘ │
│                            │  │                            │
│  ┌──────────────────────┐ │  │                            │
│  │ Storage (S3-compat)  │ │  │                            │
│  │ - User uploads       │ │  │                            │
│  │ - Generated images   │ │  │                            │
│  └──────────────────────┘ │  │                            │
└────────────────────────────┘  └────────────────────────────┘
```

### Component Interaction Flow

```
USER ACTION → FRONTEND → API GATEWAY → SUPABASE
                   ↓
            RUNPOD/COMFYUI
                   ↓
            WEBHOOK CALLBACK
                   ↓
            UPDATE DATABASE
                   ↓
            NOTIFY FRONTEND
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.3 | Type safety |
| Vite | 5.4.2 | Build tool |
| Tailwind CSS | 3.4.1 | Styling |
| Lucide React | 0.344.0 | Icons |
| Supabase JS | 2.57.4 | Backend SDK |

### Backend (Recommended)
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime environment |
| Express.js | API framework |
| Bull / BullMQ | Job queue management |
| Redis | Cache & session storage |
| Sharp | Image processing |

### Database
| Component | Technology |
|-----------|------------|
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (S3-compatible) |
| Real-time | Supabase Realtime |

### AI Infrastructure
| Component | Technology |
|-----------|------------|
| GPU Compute | RunPod Serverless |
| AI Engine | ComfyUI |
| Models | SDXL, ControlNet, IP-Adapter, etc. |
| Storage | RunPod Network Volume |

---

## Database Schema

### Core Tables

#### 1. profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. credits
```sql
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. generation_history
```sql
CREATE TABLE generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workflow_type TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  input_image_url TEXT,
  output_image_url TEXT NOT NULL,
  input_data JSONB,
  prompt TEXT,
  credits_used INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'processing')),
  error_message TEXT,
  job_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

#### 4. projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  campaign TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  image_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 5. project_images
```sql
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID REFERENCES generation_history(id),
  image_url TEXT NOT NULL,
  workflow_type TEXT,
  notes TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 6. subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id UUID REFERENCES billing_plans(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 7. billing_plans
```sql
CREATE TABLE billing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  credits_per_month INTEGER NOT NULL,
  features JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 8. credit_transactions
```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  generation_id UUID REFERENCES generation_history(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 9. support_tickets
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 10. user_settings
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  default_output_format TEXT DEFAULT 'webp',
  default_output_count INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 11. invoices
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'failed')),
  plan_name TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 12. api_keys
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies like:

```sql
-- Example for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

---

## API Specifications

### Base URL Structure
```
Production: https://api.shootx.com/v1
Staging: https://api-staging.shootx.com/v1
Development: http://localhost:3000/v1
```

### Authentication
All API requests require authentication via Bearer token:
```
Authorization: Bearer {JWT_TOKEN}
```

### Required API Endpoints

#### 1. Generation Endpoints

**POST /api/v1/generate**
Submit a new generation job.

Request:
```json
{
  "workflow_type": "model",
  "input_data": {
    "gender": "female",
    "pose": "standing",
    "age_range": "25-35"
  },
  "settings": {
    "output_count": 2,
    "output_format": "webp"
  }
}
```

Response:
```json
{
  "generation_id": "uuid",
  "job_id": "runpod_job_id",
  "status": "processing",
  "credits_charged": 2,
  "estimated_time": 30
}
```

**GET /api/v1/generations/{generation_id}**
Get generation status and results.

Response:
```json
{
  "id": "uuid",
  "status": "completed",
  "workflow_type": "model",
  "output_images": ["url1", "url2"],
  "created_at": "2024-11-14T10:00:00Z",
  "completed_at": "2024-11-14T10:00:28Z"
}
```

#### 2. Credit Management

**GET /api/v1/credits**
Get user credit balance.

Response:
```json
{
  "balance": 150,
  "total_earned": 200,
  "total_spent": 50
}
```

**GET /api/v1/credits/transactions**
Get credit transaction history.

Response:
```json
{
  "transactions": [
    {
      "id": "uuid",
      "amount": -2,
      "type": "usage",
      "description": "Human model generation",
      "created_at": "2024-11-14T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}
```

#### 3. Project Management

**GET /api/v1/projects**
List user projects.

**POST /api/v1/projects**
Create new project.

**PUT /api/v1/projects/{project_id}**
Update project.

**DELETE /api/v1/projects/{project_id}**
Delete project.

**POST /api/v1/projects/{project_id}/images**
Add images to project.

#### 4. User Management

**GET /api/v1/user/profile**
Get user profile.

**PUT /api/v1/user/profile**
Update user profile.

**GET /api/v1/user/settings**
Get user settings.

**PUT /api/v1/user/settings**
Update user settings.

#### 5. Subscription & Billing

**GET /api/v1/subscriptions**
Get user subscription.

**POST /api/v1/subscriptions**
Create subscription.

**GET /api/v1/billing/plans**
List available plans.

**GET /api/v1/billing/invoices**
List user invoices.

#### 6. Support

**GET /api/v1/support/tickets**
List support tickets.

**POST /api/v1/support/tickets**
Create support ticket.

**GET /api/v1/support/tickets/{ticket_id}**
Get ticket details.

---

## ComfyUI Workflow Requirements

### General Specifications

All workflows must:
1. Accept JSON input via RunPod API
2. Return standardized JSON output
3. Support batch processing (1-4 images)
4. Complete within 30 seconds (target)
5. Handle errors gracefully
6. Support webhook callbacks

### Workflow 1: Human Model Generation
**ID**: `model`

**Input:**
```json
{
  "workflow_type": "model",
  "input": {
    "gender": "male|female|non-binary",
    "pose": "standing|sitting|walking|action",
    "age_range": "18-25|25-35|35-50|50+",
    "ethnicity": "caucasian|asian|african|hispanic|mixed",
    "style": "casual|formal|athletic|professional",
    "background": "studio_white|studio_gray|natural",
    "lighting": "studio|natural|dramatic",
    "prompt": "optional text prompt"
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Output:**
```json
{
  "images": ["base64_or_url_1", "base64_or_url_2"],
  "metadata": {
    "resolution": "1024x1536",
    "format": "webp",
    "generation_time": 18.5,
    "model_used": "sdxl_base"
  }
}
```

**Requirements:**
- Full body generation
- Photorealistic quality
- Proper hand rendering
- Consistent lighting
- High-resolution output (min 1024x1536)

### Workflow 2: Virtual Try-On
**ID**: `tryon`

**Input:**
```json
{
  "workflow_type": "tryon",
  "input": {
    "model_image": "url_or_base64",
    "product_image": "url_or_base64",
    "product_type": "top|bottom|dress|outerwear|shoes|accessory",
    "fit_style": "tight|regular|loose",
    "preserve_background": true
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Requirements:**
- Realistic fabric draping
- Proper shadows and highlights
- Maintain product texture
- Preserve body proportions
- Background preservation option

### Workflow 3: Color Change
**ID**: `color_change`

**Input:**
```json
{
  "workflow_type": "color_change",
  "input": {
    "image": "url_or_base64",
    "target_area": "product|background|all",
    "target_color": "#FF0000",
    "color_method": "automatic|manual",
    "mask": "optional_mask_image",
    "preserve_texture": true
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Requirements:**
- Preserve texture and details
- Accurate color application
- Support hex color codes
- Optional manual masking
- Smart edge detection

### Workflow 4: Image Upscale
**ID**: `upscale`

**Input:**
```json
{
  "workflow_type": "upscale",
  "input": {
    "image": "url_or_base64",
    "scale_factor": 2,
    "denoise_strength": 0.3,
    "add_details": true
  },
  "num_outputs": 1,
  "output_format": "webp"
}
```

**Requirements:**
- 2x, 3x, or 4x upscaling
- Detail enhancement
- Noise reduction
- Sharp edges
- No artifacts

### Workflow 5: Graphic Transfer
**ID**: `graphic_transfer`

**Input:**
```json
{
  "workflow_type": "graphic_transfer",
  "input": {
    "base_image": "url_or_base64",
    "graphic_image": "url_or_base64",
    "placement": "front|back|sleeve|custom",
    "scale": 1.0,
    "position": {"x": 0.5, "y": 0.5},
    "blend_mode": "multiply|overlay|normal"
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Requirements:**
- Perspective-aware placement
- Natural integration
- Support transparency
- Wrinkle and fold adaptation

### Workflow 6: Resize Photo
**ID**: `resize`

**Input:**
```json
{
  "workflow_type": "resize",
  "input": {
    "image": "url_or_base64",
    "target_width": 1920,
    "target_height": 1080,
    "method": "fill|fit|stretch",
    "fill_method": "inpaint|blur|extend"
  },
  "num_outputs": 1,
  "output_format": "webp"
}
```

**Requirements:**
- Content-aware resizing
- Smart cropping
- Intelligent fill for empty areas
- Maintain aspect ratio option

### Workflow 7: Background Change/Generation
**ID**: `background`

**Input:**
```json
{
  "workflow_type": "background",
  "input": {
    "image": "url_or_base64",
    "background_type": "remove|replace|generate",
    "background_prompt": "modern office interior",
    "background_image": "optional_url_or_base64",
    "edge_refinement": true
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Requirements:**
- Clean background removal
- Accurate edge detection
- Realistic replacement/generation
- Natural lighting integration
- Shadow generation

### Workflow 8: Lifestyle Scene
**ID**: "lifestyle"

**Input:**
```json
{
  "workflow_type": "lifestyle",
  "input": {
    "product_image": "url_or_base64",
    "scene_type": "home|office|outdoor|cafe|studio",
    "scene_prompt": "cozy bedroom setting",
    "lighting": "natural|warm|cool|dramatic",
    "context_objects": ["book", "coffee", "plant"]
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Requirements:**
- Natural product placement
- Coherent scene composition
- Realistic lighting
- Context-appropriate objects
- High-quality rendering

### Workflow 9: Video Generation
**ID**: `video`

**Input:**
```json
{
  "workflow_type": "video",
  "input": {
    "image": "url_or_base64",
    "motion_type": "zoom_in|zoom_out|pan_left|pan_right|rotate",
    "duration": 3,
    "fps": 24,
    "loop": true
  },
  "num_outputs": 1,
  "output_format": "mp4"
}
```

**Requirements:**
- Smooth motion
- 3-5 second duration
- 24-30 fps
- Loop-ready output
- HD quality (1080p min)

### Workflow 10: Social Media Poster
**ID**: `poster`

**Input:**
```json
{
  "workflow_type": "poster",
  "input": {
    "image": "url_or_base64",
    "platform": "instagram|facebook|twitter|linkedin",
    "layout": "portrait|square|landscape",
    "add_text": false,
    "text_content": "optional text",
    "brand_colors": ["#FF0000", "#00FF00"]
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

**Requirements:**
- Platform-specific dimensions
- Optimized file size
- Brand-aware layouts
- Text overlay support
- Quick generation (< 10s)

### Workflow Output Standards

All workflows must return:

```json
{
  "status": "success",
  "images": [
    {
      "url": "https://storage.url/image1.webp",
      "width": 1024,
      "height": 1536,
      "format": "webp",
      "size_bytes": 245000
    }
  ],
  "metadata": {
    "generation_time": 18.5,
    "model_used": "sdxl_turbo",
    "steps": 25,
    "cfg_scale": 7.0,
    "seed": 12345
  },
  "credits_used": 2
}
```

### Error Handling

Errors must return:

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_INPUT",
    "message": "Image resolution too low",
    "details": "Minimum resolution is 512x512"
  }
}
```

---

## Frontend Integration Points

### Service Layer
Location: `src/services/comfyui.ts`

This service handles all API communication. Update these base URLs:

```typescript
const API_URL = import.meta.env.VITE_COMFYUI_API_URL;
const API_KEY = import.meta.env.VITE_COMFYUI_API_KEY;
```

### Key Integration Points

#### 1. Workflow Submission
File: `src/components/studio/WorkflowOptions.tsx`

Each workflow component calls:
```typescript
comfyUIService.submitWorkflow(workflowRequest)
```

#### 2. Status Polling
File: `src/services/comfyui.ts`

Polls job status every 5 seconds:
```typescript
pollJobUntilComplete(generationId, jobId, maxAttempts, interval)
```

#### 3. Result Display
File: `src/components/studio/ChatInterface.tsx`

Displays results in chat-style interface with:
- Image thumbnails
- Download buttons
- Workflow suggestions
- Error messages

#### 4. Credit Checking
Multiple files check credits before generation:
```typescript
// Check if user has enough credits
const hasCredits = await checkUserCredits(requiredCredits);
```

### Environment Variables Required

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# API
VITE_COMFYUI_API_URL=https://api.runpod.io/v2/your-endpoint
VITE_COMFYUI_API_KEY=your_runpod_key

# Optional
VITE_ENVIRONMENT=production|staging|development
VITE_ENABLE_DEBUG=false
```

---

## Security & Authentication

### Authentication Flow

```
1. User signs up/logs in via Supabase Auth
2. Frontend receives JWT token
3. Token included in all API requests
4. Backend validates token with Supabase
5. RLS policies enforce data access
```

### JWT Token Structure
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "app_metadata": {
    "provider": "email"
  },
  "user_metadata": {},
  "role": "authenticated",
  "aal": "aal1",
  "iat": 1699876543,
  "exp": 1699880143
}
```

### API Key Management
- Service-to-service: API keys in environment variables
- User-to-API: JWT tokens from Supabase
- RunPod: API key for ComfyUI execution

### Security Requirements

1. **HTTPS Only**: All production traffic over TLS 1.3+
2. **Rate Limiting**:
   - Anonymous: 10 req/min
   - Authenticated: 100 req/min
   - Premium: 500 req/min
3. **Input Validation**: Sanitize all user inputs
4. **CORS**: Whitelist frontend domains only
5. **SQL Injection**: Use parameterized queries
6. **XSS Protection**: Sanitize displayed content
7. **CSRF Protection**: Use CSRF tokens

---

## Deployment Architecture

### Frontend Deployment
**Recommended**: Vercel / Netlify

Configuration:
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Backend Deployment
**Recommended**: AWS ECS / Google Cloud Run / Railway

Requirements:
- Auto-scaling: 1-10 instances
- Load balancer: Round-robin
- Health checks: /health endpoint
- Logging: JSON structured logs
- Monitoring: Datadog / New Relic

### Database
**Provider**: Supabase (hosted PostgreSQL)

Configuration:
- Instance: Production tier
- Connection pooling: PgBouncer
- Backups: Daily automated
- Replication: Real-time to read replicas

### Image Storage
**Provider**: Supabase Storage (S3-compatible)

Structure:
```
/user-uploads/{user_id}/{timestamp}_{filename}
/generations/{generation_id}/{image_number}.webp
/temp/{job_id}/{filename}
```

Policies:
- Public read for generated images
- Authenticated upload only
- 10MB max file size
- Allowed formats: jpg, png, webp, avif

### ComfyUI Deployment
**Provider**: RunPod Serverless

Configuration:
- GPU: NVIDIA A100 / A40
- vRAM: 24GB minimum
- Docker image: Custom ComfyUI build
- Network volume: For model storage
- Auto-scaling: Based on queue length

---

## Development Workflow

### Local Development Setup

1. **Clone Repository**
```bash
git clone https://github.com/your-org/shootx.git
cd shootx
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start Development Server**
```bash
npm run dev
# Opens at http://localhost:5173
```

5. **Database Setup**
```bash
# Apply migrations via Supabase CLI
supabase db push
```

### Git Workflow

```
main (production)
  ↑
staging (pre-production testing)
  ↑
development (active development)
  ↑
feature/* (individual features)
```

### Code Standards

**TypeScript:**
- Strict mode enabled
- No implicit any
- Proper interface definitions
- JSDoc comments for public APIs

**React:**
- Functional components only
- Hooks for state management
- Props destructuring
- Proper key props in lists

**CSS:**
- Tailwind utility classes
- No inline styles
- Responsive design first
- Dark mode support

### Build Process

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Preview build
npm run preview
```

---

## Testing Requirements

### Frontend Testing

**Unit Tests**: Jest + React Testing Library
```typescript
describe('WorkflowSelector', () => {
  it('renders all 10 workflows', () => {
    render(<WorkflowSelector />);
    expect(screen.getAllByRole('button')).toHaveLength(10);
  });
});
```

**Integration Tests**: Playwright
```typescript
test('complete generation flow', async ({ page }) => {
  await page.goto('/studio');
  await page.click('[data-testid="workflow-model"]');
  await page.fill('[data-testid="prompt"]', 'test prompt');
  await page.click('[data-testid="generate"]');
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

### Backend Testing

**Unit Tests**: Jest / Vitest
- API endpoint handlers
- Credit calculation logic
- Workflow parameter validation
- Database queries

**Integration Tests**: Supertest
- Complete API flows
- Database transactions
- External API mocking
- Error scenarios

### ComfyUI Testing

**Workflow Tests**:
- Input validation
- Output format verification
- Generation quality checks
- Performance benchmarks
- Error handling

**Test Cases Per Workflow**:
1. Valid input → expected output
2. Missing required parameters → error
3. Invalid parameters → error
4. Large images → handles properly
5. Batch processing → all outputs generated

---

## Performance Requirements

### Response Time Targets

| Operation | Target | Maximum |
|-----------|--------|---------|
| API response | < 200ms | < 500ms |
| Page load | < 2s | < 3s |
| Generation start | < 1s | < 2s |
| Generation complete | < 20s | < 30s |
| Image upload | < 3s | < 5s |

### Throughput Requirements

| Metric | Target |
|--------|--------|
| Concurrent users | 100+ |
| Requests/second | 50+ |
| Generations/minute | 100+ |
| Database queries/second | 500+ |

### Optimization Guidelines

**Frontend:**
- Code splitting per route
- Lazy load images
- Compress assets (gzip/brotli)
- Cache static resources
- Minimize bundle size

**Backend:**
- Connection pooling
- Query optimization
- Response caching (Redis)
- Batch database operations
- Async processing

**ComfyUI:**
- Model preloading
- Batch processing
- Queue optimization
- Resource allocation
- Result caching

---

## Monitoring & Logging

### Metrics to Track

**Application:**
- Request rate
- Error rate
- Response times (p50, p95, p99)
- Active users
- Generation success rate

**Infrastructure:**
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth
- GPU utilization

**Business:**
- Daily active users
- Generations per user
- Credit consumption
- Subscription conversions
- Support ticket volume

### Logging Standards

**Frontend:**
```javascript
console.log('[INFO] User initiated generation', {
  workflow: 'model',
  userId: user.id
});
```

**Backend:**
```json
{
  "timestamp": "2024-11-14T10:00:00Z",
  "level": "info",
  "service": "api-gateway",
  "message": "Generation started",
  "userId": "uuid",
  "generationId": "uuid",
  "workflow": "model"
}
```

### Error Tracking

**Frontend**: Sentry
```typescript
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1
});
```

**Backend**: Structured logging + Sentry
```typescript
logger.error('Generation failed', {
  error: error.message,
  stack: error.stack,
  generationId: id
});
```

---

## Environment Configuration

### Development
```env
NODE_ENV=development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=local_key
VITE_COMFYUI_API_URL=http://localhost:8000
VITE_ENABLE_DEBUG=true
```

### Staging
```env
NODE_ENV=staging
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging_key
VITE_COMFYUI_API_URL=https://staging-api.runpod.io
VITE_ENABLE_DEBUG=false
```

### Production
```env
NODE_ENV=production
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=anon_key
VITE_COMFYUI_API_URL=https://api.runpod.io
VITE_ENABLE_DEBUG=false
```

---

## Appendix A: File Structure

```
shootx/
├── public/
│   ├── Fav-shootx.jpg
│   └── shootx logo.png
├── src/
│   ├── components/
│   │   ├── studio/
│   │   │   ├── BackgroundOptions.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ColorChangeOptions.tsx
│   │   │   ├── GraphicTransferOptions.tsx
│   │   │   ├── HumanModelOptions.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── LifestyleOptions.tsx
│   │   │   ├── ManualMaskingEditor.tsx
│   │   │   ├── MaskingCanvas.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MinimalChatControls.tsx
│   │   │   ├── PredefinedPrompts.tsx
│   │   │   ├── ResizePhotoOptions.tsx
│   │   │   ├── SocialPosterOptions.tsx
│   │   │   ├── UpscaleOptions.tsx
│   │   │   ├── VideoGenOptions.tsx
│   │   │   ├── VirtualTryonOptions.tsx
│   │   │   ├── WorkflowOptions.tsx
│   │   │   ├── WorkflowSelector.tsx
│   │   │   ├── WorkflowSidebar.tsx
│   │   │   ├── WorkflowSuggestions.tsx
│   │   │   └── WorkflowTopBar.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── Auth.tsx
│   │   ├── Billing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── History.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── MobileWorkflowSelector.tsx
│   │   ├── Profile.tsx
│   │   ├── Projects.tsx
│   │   ├── Settings.tsx
│   │   ├── SettingsMenu.tsx
│   │   ├── Studio.tsx
│   │   └── Support.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   ├── database.types.ts
│   │   ├── supabase.ts
│   │   └── workflowChaining.ts
│   ├── services/
│   │   └── comfyui.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   └── migrations/
│       ├── 20251103190408_create_shootx_schema.sql
│       └── 20251105034735_add_missing_features.sql
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── API_INTEGRATION_GUIDE.md
├── BACKEND_REQUIREMENTS.md
├── COMFYUI_WORKFLOW_REQUIREMENTS.md
├── MENU_AND_COPY_UPDATES.md
├── PROJECT_OVERVIEW.md
├── RESPONSIVE_DESIGN.md
├── SIDEBAR_REMOVAL_UPDATE.md
├── TECHNICAL_SPECIFICATION.md (this file)
└── WORKFLOW_SELECTOR_UPDATE.md
```

---

## Appendix B: Quick Start Checklist

### For ComfyUI Developers
- [ ] Read ComfyUI Workflow Requirements section
- [ ] Set up local ComfyUI environment
- [ ] Implement Workflow 1 (Human Model) as proof of concept
- [ ] Test input/output format
- [ ] Deploy to RunPod staging
- [ ] Implement remaining 9 workflows
- [ ] Performance testing
- [ ] Production deployment

### For API Developers
- [ ] Read API Specifications section
- [ ] Set up local development environment
- [ ] Configure Supabase connection
- [ ] Implement /generate endpoint
- [ ] Implement job status checking
- [ ] Implement webhook handling
- [ ] Credit management system
- [ ] Image storage integration
- [ ] Error handling
- [ ] Rate limiting
- [ ] Testing
- [ ] Documentation

### For Integration Team
- [ ] Review entire document
- [ ] Set up Supabase project
- [ ] Apply database migrations
- [ ] Configure environment variables
- [ ] Connect frontend to backend API
- [ ] Test each workflow end-to-end
- [ ] Monitor performance
- [ ] Security audit
- [ ] Production deployment
- [ ] Post-launch monitoring

---

## Appendix C: Support & Resources

### Documentation
- Main docs: This file
- API guide: API_INTEGRATION_GUIDE.md
- Backend specs: BACKEND_REQUIREMENTS.md
- Workflow specs: COMFYUI_WORKFLOW_REQUIREMENTS.md

### External Resources
- Supabase Docs: https://supabase.com/docs
- RunPod Docs: https://docs.runpod.io
- ComfyUI Docs: https://github.com/comfyanonymous/ComfyUI
- React Docs: https://react.dev

### Contact
- Technical Lead: [Your Email]
- Project Manager: [PM Email]
- Repository: [GitHub URL]
- Issue Tracker: [Issues URL]

---

## Appendix D: Changelog

### Version 2.0 - November 2024
- Complete frontend redesign
- 7 core modules implemented
- History module added
- Left sidebar navigation
- Generic copy updates
- Production-ready frontend
- Comprehensive technical documentation

### Version 1.0 - November 2024
- Initial project setup
- Basic workflow interfaces
- Supabase integration
- Authentication system
- Database schema design

---

**Document Version**: 2.0
**Last Updated**: November 14, 2024
**Status**: Production-Ready Frontend | Backend Integration Required

---

**End of Technical Specification Document**

This document is maintained by the ShootX development team and should be updated as the project evolves.
