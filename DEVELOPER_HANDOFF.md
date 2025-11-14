# ShootX Developer Handoff Document
**Quick Reference Guide for ComfyUI & API Developers**

---

## 🎯 What You Need to Know

ShootX is a **complete, production-ready AI visual generation platform**. The frontend is 100% done. We need:
1. **Backend API** to connect frontend to ComfyUI
2. **10 ComfyUI workflows** designed and deployed on RunPod

---

## 📦 What's Already Built

### ✅ Complete Frontend (React + TypeScript)
- 7 main modules: Studio, Projects, History, Profile, Billing, Support, Settings
- 10 workflow interfaces with full UI
- Authentication system (Supabase Auth)
- Credit system UI
- Project organization
- Generation history
- Real-time status updates
- Responsive design
- Dark/light themes

### ✅ Database Schema
- 12 tables designed and deployed in Supabase
- Row Level Security (RLS) configured
- All migrations ready

### ✅ Documentation
- Complete technical specifications
- API integration guide
- ComfyUI workflow requirements
- Backend requirements

---

## 🔧 What Needs to Be Built

### 1. Backend API (High Priority)
**Your Job**: Create API service that connects frontend to ComfyUI

**Key Endpoints Needed**:
```
POST   /api/v1/generate          # Submit generation job
GET    /api/v1/generations/:id   # Check job status
GET    /api/v1/credits            # Get credit balance
POST   /api/v1/credits/deduct    # Deduct credits
GET    /api/v1/projects           # List projects
POST   /api/v1/projects           # Create project
```

**Technologies**: Node.js / Python / Go (your choice)

**Must Handle**:
- Authentication (validate Supabase JWT)
- Job queue management (Bull/BullMQ recommended)
- Credit checking and deduction
- Image upload/storage (Supabase Storage)
- Webhook callbacks from RunPod
- Error handling

**See**: `BACKEND_REQUIREMENTS.md` for full details

---

### 2. ComfyUI Workflows (High Priority)
**Your Job**: Design and deploy 10 AI workflows on RunPod

**The 10 Workflows**:

1. **Human Model Generation** (`model`)
   - Generate AI human models for product photography
   - Input: gender, pose, age, ethnicity, style
   - Output: Full-body photorealistic model

2. **Virtual Try-On** (`tryon`)
   - Place clothing/products on models
   - Input: model image + product image
   - Output: Model wearing the product

3. **Color Change** (`color_change`)
   - Change product colors while preserving texture
   - Input: image + target color
   - Output: Recolored image

4. **Image Upscale** (`upscale`)
   - Enhance resolution and add details
   - Input: image + scale factor
   - Output: Upscaled high-quality image

5. **Graphic Transfer** (`graphic_transfer`)
   - Place graphics/logos on products
   - Input: base image + graphic image
   - Output: Product with graphic applied

6. **Resize Photo** (`resize`)
   - Smart content-aware resizing
   - Input: image + target dimensions
   - Output: Resized image with intelligent fill

7. **Background Change** (`background`)
   - Replace or generate backgrounds
   - Input: image + background prompt/image
   - Output: Image with new background

8. **Lifestyle Scene** (`lifestyle`)
   - Place products in realistic environments
   - Input: product + scene prompt
   - Output: Product in lifestyle setting

9. **Video Generation** (`video`)
   - Create short videos from images
   - Input: image + motion type
   - Output: 3-5 second video (MP4)

10. **Social Media Poster** (`poster`)
    - Optimize images for social platforms
    - Input: image + platform + layout
    - Output: Platform-optimized image

**See**: `COMFYUI_WORKFLOW_REQUIREMENTS.md` for detailed specs

---

## 🏗️ System Architecture

```
┌─────────────┐
│   FRONTEND  │  ← Already built (React)
│  (Complete) │
└──────┬──────┘
       │
       │ HTTPS/JWT
       │
       ▼
┌─────────────┐
│  BACKEND    │  ← YOU BUILD THIS
│     API     │  - Node.js/Python/Go
└──────┬──────┘  - Job queue (Bull)
       │          - Credit management
       │          - Image storage
       │
       ├─────────┬─────────┐
       │         │         │
       ▼         ▼         ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │SUPABASE│ │ RUNPOD │ │STORAGE │
   │Database│ │ComfyUI │ │  (S3)  │
   └────────┘ └────────┘ └────────┘
                   ▲
                   │
              YOU BUILD THESE
              10 ComfyUI workflows
```

---

## 📋 Standard Input/Output Format

### Standard Request to ComfyUI
```json
{
  "workflow_type": "model",
  "input": {
    "gender": "female",
    "pose": "standing",
    "age_range": "25-35"
  },
  "num_outputs": 2,
  "output_format": "webp"
}
```

### Standard Response from ComfyUI
```json
{
  "status": "success",
  "images": [
    "https://storage.url/image1.webp",
    "https://storage.url/image2.webp"
  ],
  "metadata": {
    "resolution": "1024x1536",
    "format": "webp",
    "generation_time": 18.5
  }
}
```

---

## 🔐 Authentication Flow

```
1. User logs in → Frontend gets JWT from Supabase
2. Frontend sends request with: Authorization: Bearer <JWT>
3. Backend validates JWT with Supabase
4. Backend checks user credits
5. Backend submits job to RunPod
6. Backend returns job ID to frontend
7. Frontend polls for status
8. RunPod sends webhook when complete
9. Backend updates database
10. Frontend displays result
```

---

## 💳 Credit System

### How Credits Work
- Each workflow costs 1-5 credits
- Users purchase credits or subscribe
- Credits checked before generation
- Credits deducted when job starts
- Refunded if job fails

### Credit Costs (Recommended)
```
Human Model:       2 credits
Virtual Try-On:    3 credits
Color Change:      1 credit
Upscale:           2 credits
Graphic Transfer:  2 credits
Resize:            1 credit
Background:        2 credits
Lifestyle:         3 credits
Video:             5 credits
Social Poster:     1 credit
```

---

## 📊 Database Schema Quick Reference

### Key Tables

**generation_history**
```sql
- id (UUID)
- user_id (UUID)
- workflow_type (TEXT)
- input_image_url (TEXT)
- output_image_url (TEXT)
- credits_used (INTEGER)
- status (TEXT: completed|failed|processing)
- job_id (TEXT)
- created_at (TIMESTAMP)
```

**credits**
```sql
- id (UUID)
- user_id (UUID)
- balance (INTEGER)
- total_earned (INTEGER)
- total_spent (INTEGER)
```

**projects**
```sql
- id (UUID)
- user_id (UUID)
- name (TEXT)
- description (TEXT)
- image_count (INTEGER)
```

**See**: Full schema in `TECHNICAL_SPECIFICATION.md`

---

## 🚀 Development Setup

### Frontend (Already Works)
```bash
cd shootx
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend (You Build)
```bash
# Example Node.js setup
npm init -y
npm install express bull redis @supabase/supabase-js

# Create server.js
# Implement endpoints
# Connect to Supabase & RunPod
```

### ComfyUI (You Deploy)
```bash
# On RunPod:
1. Create serverless endpoint
2. Upload ComfyUI Docker image
3. Add custom workflows
4. Configure webhook callback
5. Test each workflow
```

---

## 🧪 Testing Checklist

### Backend API Testing
- [ ] POST /generate accepts all 10 workflow types
- [ ] JWT validation works
- [ ] Credit checking works
- [ ] Credit deduction works
- [ ] Job status polling works
- [ ] Webhook callbacks work
- [ ] Image upload works
- [ ] Error handling works
- [ ] Rate limiting works

### ComfyUI Workflow Testing
For each of 10 workflows:
- [ ] Accepts correct input format
- [ ] Returns correct output format
- [ ] Generates in < 30 seconds
- [ ] Quality meets standards
- [ ] Handles errors gracefully
- [ ] Batch processing works (1-4 images)

---

## 📈 Performance Requirements

| Metric | Target |
|--------|--------|
| API response time | < 500ms |
| Generation time | < 30s |
| Success rate | > 95% |
| Concurrent users | 100+ |
| Uptime | > 99.9% |

---

## 🔗 Integration Points

### Frontend Service Layer
**File**: `src/services/comfyui.ts`

This is where frontend calls your API:
```typescript
const API_URL = import.meta.env.VITE_COMFYUI_API_URL;

async submitWorkflow(request: WorkflowRequest) {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  return response.json();
}
```

**Your backend must**:
1. Accept POST to `/generate`
2. Validate JWT token
3. Check credits
4. Submit to RunPod
5. Return job ID
6. Handle webhook
7. Update database

---

## 🛠️ Tech Stack

### Frontend (Already Built)
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Supabase JS Client

### Backend (You Choose)
**Recommended**: Node.js + Express
**Alternatives**: Python + FastAPI, Go + Gin

**Must Have**:
- Job queue (Bull/BullMQ)
- Redis (for queue)
- Supabase client
- Image processing (Sharp)

### AI Infrastructure
- RunPod Serverless (GPU)
- ComfyUI (AI engine)
- SDXL models
- ControlNet
- IP-Adapter

---

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_COMFYUI_API_URL=https://your-api.com/v1
```

### Backend (.env)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
RUNPOD_API_KEY=your_runpod_key
RUNPOD_API_URL=https://api.runpod.io/v2
COMFYUI_ENDPOINT_ID=your_endpoint_id
REDIS_URL=redis://localhost:6379
STORAGE_BUCKET=shootx-images
```

---

## 📚 Documentation Files

1. **TECHNICAL_SPECIFICATION.md** (100+ pages)
   - Complete system architecture
   - All API specifications
   - All workflow requirements
   - Database schema
   - Security requirements

2. **API_INTEGRATION_GUIDE.md**
   - Frontend service layer explained
   - API endpoint specs
   - Request/response formats
   - Testing guide

3. **BACKEND_REQUIREMENTS.md**
   - Backend implementation guide
   - Job queue setup
   - Credit management
   - Image storage
   - Error handling

4. **COMFYUI_WORKFLOW_REQUIREMENTS.md**
   - Detailed specs for all 10 workflows
   - Input/output formats
   - Quality standards
   - Use case examples

---

## 🎯 Getting Started (Step-by-Step)

### Week 1: Setup & Proof of Concept
1. ✅ Read this document
2. ✅ Read TECHNICAL_SPECIFICATION.md
3. ✅ Set up Supabase project
4. ✅ Apply database migrations
5. ✅ Create simple backend API (just /health endpoint)
6. ✅ Implement 1 workflow (Human Model) in ComfyUI
7. ✅ Deploy to RunPod staging
8. ✅ Test end-to-end with frontend

### Week 2-3: Core Implementation
1. ✅ Implement all API endpoints
2. ✅ Set up job queue (Bull + Redis)
3. ✅ Implement credit system
4. ✅ Set up image storage
5. ✅ Implement all 10 ComfyUI workflows
6. ✅ Test each workflow individually

### Week 4: Integration & Testing
1. ✅ Connect all pieces together
2. ✅ End-to-end testing
3. ✅ Performance testing
4. ✅ Security audit
5. ✅ Load testing

### Week 5: Production Deployment
1. ✅ Deploy backend to production
2. ✅ Deploy ComfyUI workflows
3. ✅ Configure monitoring
4. ✅ Set up alerts
5. ✅ Go live! 🚀

---

## 🆘 Common Questions

### Q: Which backend language should I use?
**A**: Node.js with Express is recommended for familiarity and ecosystem, but Python (FastAPI) or Go work too.

### Q: How do I test without RunPod credits?
**A**: Use RunPod's free tier or mock the ComfyUI responses during development.

### Q: What if a generation fails?
**A**: Refund credits, log the error, notify user. See error handling in BACKEND_REQUIREMENTS.md.

### Q: How to handle long-running jobs?
**A**: Use webhook callbacks from RunPod. Don't make the user wait for HTTP response.

### Q: Where do I store images?
**A**: Supabase Storage (S3-compatible). See BACKEND_REQUIREMENTS.md for setup.

### Q: How to scale ComfyUI?
**A**: RunPod serverless auto-scales based on queue. Configure min/max workers.

---

## 📞 Support & Contact

### Need Help?
1. Read the full documentation (TECHNICAL_SPECIFICATION.md)
2. Check specific guides (API, Backend, ComfyUI docs)
3. Review code in `src/services/comfyui.ts`
4. Contact technical lead: [Your Email]

### Resources
- Supabase Docs: https://supabase.com/docs
- RunPod Docs: https://docs.runpod.io
- ComfyUI: https://github.com/comfyanonymous/ComfyUI
- React: https://react.dev

---

## ✅ Definition of Done

### Backend API is complete when:
- [ ] All 15+ endpoints implemented
- [ ] JWT authentication working
- [ ] Credit system functional
- [ ] Job queue processing
- [ ] Webhook callbacks handled
- [ ] Image upload/download working
- [ ] Error handling comprehensive
- [ ] Tests passing (80%+ coverage)
- [ ] API documentation complete
- [ ] Deployed to production

### ComfyUI Workflows complete when:
- [ ] All 10 workflows implemented
- [ ] Input/output format standardized
- [ ] Quality meets requirements
- [ ] Performance < 30s per generation
- [ ] Error handling works
- [ ] Deployed to RunPod
- [ ] Webhook integration working
- [ ] All workflows tested
- [ ] Documentation complete

### Full System complete when:
- [ ] Frontend connects to backend ✅ (already works)
- [ ] User can generate with all 10 workflows
- [ ] Credits deduct properly
- [ ] Results display in UI
- [ ] Projects save properly
- [ ] History tracks all generations
- [ ] Error messages show correctly
- [ ] Performance meets targets
- [ ] Security audit passed
- [ ] Load testing passed
- [ ] Monitoring in place
- [ ] Production deployment successful

---

## 🎉 Success Criteria

The platform is ready to launch when:

1. **Functional**: All 10 workflows generate successfully
2. **Fast**: < 30 seconds per generation
3. **Reliable**: > 95% success rate
4. **Secure**: Authentication and authorization working
5. **Scalable**: Handles 100+ concurrent users
6. **Monitored**: Logging and alerts configured
7. **Tested**: All critical paths covered
8. **Documented**: APIs and workflows documented

---

**This is your starting point. Everything else you need is in the detailed documentation files.**

**Good luck building! 🚀**

---

**Document Version**: 1.0
**Created**: November 2024
**For**: ComfyUI Developers & API Developers
**Status**: Ready for Handoff
