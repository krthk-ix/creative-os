# ShootX - Project Overview

## Project Summary
ShootX is an AI-powered visual content generation platform designed for e-commerce brands, marketers, and content creators. The platform enables users to generate, edit, and transform images using advanced AI workflows powered by ComfyUI on RunPod.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Frontend      │────────▶│   Backend API   │────────▶│  ComfyUI/RunPod │
│   (React)       │         │   (Your Service)│         │   (GPU Workers) │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────────────────────────────┐
│      Supabase                           │
│  (Database, Auth, Storage)              │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context API
- **Authentication**: Supabase Auth

### Backend (To Be Implemented)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Compute**: RunPod Serverless
- **AI Engine**: ComfyUI

## Core Features

### 1. AI Workflows (10 Total)

1. **Human Model Generation** - Generate AI models for product photography
2. **Virtual Try-On** - Place garments on models realistically
3. **Color Change** - Change product colors while preserving texture
4. **Image Upscale** - Enhance resolution and add details
5. **Graphic Transfer** - Place graphics/logos on products
6. **Resize Photo** - Smart content-aware resizing
7. **Background Generation** - Replace or generate backgrounds
8. **Lifestyle Scenes** - Place products in realistic environments
9. **Video Generation** - Create short videos from images
10. **Social Media Posters** - Optimize images for social platforms

### 2. Workflow Chaining
- Automatic suggestions for next workflow steps
- Seamless image transfer between workflows
- Smart recommendations based on current workflow
- Per-image workflow suggestions

### 3. User Management
- Email/password authentication
- User profiles with preferences
- Credit-based system
- Subscription management
- Usage tracking

### 4. Project Organization
- Save and organize generations
- Brand and campaign tagging
- Search and filter capabilities
- Generation history

### 5. Settings & Preferences
- Light/Dark theme support
- Notification preferences
- Default quality settings
- Language options

## Project Structure

```
shootx/
├── src/
│   ├── components/          # React components
│   │   ├── studio/         # Studio-specific components
│   │   ├── auth/           # Authentication components
│   │   ├── Auth.tsx        # Main auth screen
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Projects.tsx    # Project management
│   │   ├── Profile.tsx     # User profile
│   │   ├── Billing.tsx     # Billing & subscriptions
│   │   ├── Settings.tsx    # User settings
│   │   └── Support.tsx     # Support tickets
│   │
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── services/           # API services
│   │   └── comfyui.ts     # ComfyUI integration service
│   │
│   ├── lib/               # Utilities & types
│   │   ├── supabase.ts
│   │   ├── database.types.ts
│   │   └── workflowChaining.ts
│   │
│   └── App.tsx            # Main app component
│
├── supabase/
│   └── migrations/        # Database migrations
│
├── BACKEND_REQUIREMENTS.md
├── API_INTEGRATION_GUIDE.md
├── COMFYUI_WORKFLOW_REQUIREMENTS.md
└── PROJECT_OVERVIEW.md (this file)
```

## Documentation Files

### 1. BACKEND_REQUIREMENTS.md
**Audience**: Backend developers
**Purpose**: Specifications for backend API implementation
**Contents**:
- Database management guidelines
- Required API endpoints
- Credit management system
- Image storage requirements
- Security & error handling
- Environment variables
- Performance requirements

### 2. API_INTEGRATION_GUIDE.md
**Audience**: API developers & integration team
**Purpose**: Guide for connecting frontend to backend
**Contents**:
- Frontend service layer explanation
- API endpoint specifications
- Request/response formats
- Workflow input parameters for all 10 workflows
- Environment configuration
- Error handling
- Testing procedures

### 3. COMFYUI_WORKFLOW_REQUIREMENTS.md
**Audience**: ComfyUI workflow designers
**Purpose**: Detailed specifications for each AI workflow
**Contents**:
- Input/output formats for each workflow
- Detailed use case examples
- Technical implementation notes
- Quality standards
- Performance targets
- Testing checklist

## Database Schema

### Key Tables

**profiles**
- User account information
- Links to Supabase Auth

**generations**
- All generation requests and outputs
- Stores workflow type, inputs, outputs, status

**projects** (Future)
- Organize generations into projects
- Campaign and brand management

**credits**
- User credit balances
- Credit tracking

**credit_transactions**
- Audit log of credit changes

**subscriptions**
- User subscription information

**billing_plans**
- Available subscription plans

**support_tickets**
- Customer support requests

**user_settings**
- User preferences and settings

## Environment Setup

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_COMFYUI_API_URL=https://api.runpod.io/v2
VITE_COMFYUI_API_KEY=your_runpod_key
```

### Backend
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
RUNPOD_API_KEY=your_runpod_api_key
RUNPOD_API_URL=https://api.runpod.io/v2
COMFYUI_ENDPOINT_ID=your_endpoint_id
STORAGE_BUCKET=shootx-images
```

## Development Workflow

### Frontend Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run typecheck   # Check TypeScript types
```

### Database Migrations
Migrations are stored in `supabase/migrations/` and can be applied using Supabase CLI or dashboard.

## Integration Steps

### Phase 1: Setup & Configuration
1. Set up Supabase project
2. Apply database migrations
3. Configure environment variables
4. Set up RunPod account and deploy ComfyUI

### Phase 2: Backend Development
1. Implement API endpoints (see BACKEND_REQUIREMENTS.md)
2. Set up job queue management
3. Implement credit system
4. Configure image storage

### Phase 3: ComfyUI Workflows
1. Design and test each workflow (see COMFYUI_WORKFLOW_REQUIREMENTS.md)
2. Deploy workflows to RunPod
3. Configure webhook callbacks
4. Performance optimization

### Phase 4: Integration Testing
1. Test API integration (see API_INTEGRATION_GUIDE.md)
2. End-to-end workflow testing
3. Load testing
4. Security audit

### Phase 5: Production Deployment
1. Frontend deployment (Vercel/Netlify recommended)
2. Backend deployment
3. Database optimization
4. Monitoring setup

## Current Status

### ✅ Completed
- Complete frontend UI/UX
- All 10 workflow interfaces
- Workflow chaining logic
- User authentication flow
- Database schema design
- Service layer for API integration
- Comprehensive documentation

### 🔄 In Progress / To Do
- Backend API implementation
- ComfyUI workflow development
- RunPod deployment
- Payment integration (Stripe)
- Production deployment

## Key Features to Highlight

### User Experience
- Clean, modern interface
- Dark/Light theme support
- Responsive design
- Intuitive workflow selection
- Real-time generation progress
- Per-image workflow suggestions

### Technical Excellence
- Type-safe TypeScript implementation
- Modular component architecture
- Scalable service layer
- Comprehensive error handling
- Performance optimized

### Business Features
- Credit-based pricing model
- Subscription tiers
- Usage analytics
- Project organization
- Customer support system

## Support & Contact

### For Technical Issues
- Check relevant documentation files
- Review browser console for errors
- Verify API connectivity
- Check Supabase logs

### For Feature Requests
- Document desired functionality
- Provide use case examples
- Specify workflow requirements

### For Integration Support
- Reference API_INTEGRATION_GUIDE.md
- Provide error logs
- Share request/response data

## Next Steps

### For Backend Team
1. Read BACKEND_REQUIREMENTS.md
2. Set up development environment
3. Implement core API endpoints
4. Test with frontend service layer

### For API Team
1. Read API_INTEGRATION_GUIDE.md
2. Review service layer implementation
3. Set up test environment
4. Implement endpoint specifications

### For ComfyUI Team
1. Read COMFYUI_WORKFLOW_REQUIREMENTS.md
2. Set up ComfyUI development environment
3. Implement and test each workflow
4. Deploy to RunPod staging environment

## Success Metrics

### Performance
- Generation time: < 30s average
- API response time: < 500ms
- Uptime: > 99.9%

### Business
- User satisfaction: > 4.5/5 stars
- Generation success rate: > 95%
- User retention: > 70% monthly

### Technical
- Error rate: < 2%
- Test coverage: > 80%
- Load capacity: 100+ concurrent users

## License & Credits

ShootX - AI Visual Content Generation Platform
Built with React, TypeScript, Tailwind CSS, and Supabase
Powered by ComfyUI and RunPod
