# ShootX - AI Visual Content Generation Platform

> Professional AI-powered image generation and editing platform for e-commerce, marketing, and creative professionals. **Fully responsive across all devices.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Responsive](https://img.shields.io/badge/responsive-mobile%20%7C%20tablet%20%7C%20desktop-success)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## 📋 Overview

ShootX is a comprehensive AI image generation platform that provides 10 professional workflows for creating and editing visual content. Built with React, TypeScript, and powered by ComfyUI on RunPod.

**Now fully responsive** - works seamlessly on mobile phones, tablets, and desktop computers!

### Key Features

- 🤖 **10 AI Workflows** - Model generation, virtual try-on, upscaling, and more
- 🔗 **Workflow Chaining** - Intelligent suggestions for multi-step editing
- 💳 **Credit System** - Flexible pay-as-you-go pricing
- 📊 **Project Management** - Organize and tag your generations
- 🎨 **Modern UI/UX** - Dark/light themes, responsive design
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🔐 **Secure Authentication** - Email/password auth via Supabase
- ⚡ **Real-time Updates** - Live generation progress tracking

## 📱 Responsive Design

ShootX is fully responsive and works beautifully across all devices:

- **Mobile (< 640px)**: Hamburger menu, single-column layouts, touch-optimized
- **Tablet (640px - 1024px)**: Adaptive multi-column grids, optimized for touch
- **Desktop (> 1024px)**: Full sidebar, multi-column layouts, mouse-optimized

**Key Responsive Features:**
- Mobile-first hamburger navigation
- Adaptive grid layouts (1-5 columns)
- Touch-optimized buttons and inputs
- Responsive typography and spacing
- Collapsible sidebars and panels

See [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) for complete responsive design documentation.

## 🏗️ Architecture

```
Frontend (React + TypeScript) → Backend API → ComfyUI/RunPod
                ↓                     ↓
            Supabase         Supabase Storage
        (Database + Auth)      (Images)
```

## 📚 Documentation

### For Development Teams

| Document | Audience | Purpose |
|----------|----------|---------|
| [📖 PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | All Teams | High-level project summary and architecture |
| [🔧 BACKEND_REQUIREMENTS.md](BACKEND_REQUIREMENTS.md) | Backend Developers | API implementation specifications |
| [🔌 API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) | API/Integration Team | Frontend-backend integration guide |
| [🎨 COMFYUI_WORKFLOW_REQUIREMENTS.md](COMFYUI_WORKFLOW_REQUIREMENTS.md) | ComfyUI Designers | Detailed workflow specifications |
| [📱 RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) | Frontend Developers | Responsive design implementation guide |

### Quick Links

- **Getting Started?** → Start with [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- **Backend Developer?** → Read [BACKEND_REQUIREMENTS.md](BACKEND_REQUIREMENTS.md)
- **Integrating APIs?** → Check [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)
- **Building Workflows?** → See [COMFYUI_WORKFLOW_REQUIREMENTS.md](COMFYUI_WORKFLOW_REQUIREMENTS.md)
- **Responsive Design?** → Review [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md)

## 🎯 Core Workflows

1. **Human Model Generation** - AI-generated models for product photography
2. **Virtual Try-On** - Realistic garment placement on models
3. **Color Change** - Product color variations with texture preservation
4. **Image Upscale** - 2x/4x/8x resolution enhancement
5. **Graphic Transfer** - Logo/graphic placement on products
6. **Resize Photo** - Content-aware image resizing
7. **Background Generation** - AI-generated or replaced backgrounds
8. **Lifestyle Scenes** - Product placement in realistic environments
9. **Video Generation** - Short video clips from images
10. **Social Media Posters** - Platform-optimized image creation

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4 (with responsive utilities)
- **Icons**: Lucide React
- **State**: React Context API
- **Responsive**: Mobile-first, fully adaptive design

### Backend (To Be Implemented)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Compute**: RunPod Serverless
- **AI Engine**: ComfyUI

## 📁 Project Structure

```
shootx/
├── src/
│   ├── components/          # React components (all responsive)
│   │   ├── studio/         # Workflow components
│   │   └── auth/           # Authentication
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── lib/               # Utilities & types
│   └── App.tsx
├── supabase/
│   └── migrations/        # Database migrations
├── docs/                  # Documentation files
└── public/               # Static assets
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ComfyUI/RunPod (for production)
VITE_COMFYUI_API_URL=https://api.runpod.io/v2
VITE_COMFYUI_API_KEY=your_runpod_api_key
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Testing Responsive Design

### Browser DevTools
1. Open Chrome/Firefox DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test various device presets

### Recommended Test Devices
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad (768x1024)
- iPad Pro (1024x1366)
- Desktop (1920x1080)

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations in `supabase/migrations/` folder
3. Update your `.env` with Supabase credentials

### Migrations
- `20251103190408_create_shootx_schema.sql` - Initial schema
- `20251105034735_add_missing_features.sql` - Additional features

## 🔐 Authentication

ShootX uses Supabase Auth with email/password authentication:

- Sign up creates a user profile automatically
- Initial credit balance is granted on signup
- Session persistence across page reloads
- Secure RLS policies for data access

## 🎨 Features in Detail

### Workflow Chaining
- Automatic suggestions for next steps
- Context-aware recommendations
- Seamless image transfer between workflows
- Smart workflow relationships

### Credit System
- Pay-as-you-go model
- Credit balance tracking
- Transaction history
- Subscription plans (Free, Pro, Enterprise)

### Project Management
- Organize generations by brand/campaign
- Tag-based organization
- Search and filter
- Generation history

### User Preferences
- Dark/light theme
- Email notifications
- Default quality settings
- Language options

### Responsive Interface
- Mobile hamburger menu
- Touch-optimized controls
- Adaptive layouts
- Progressive enhancement

## 📊 Current Status

### ✅ Completed
- Complete frontend UI/UX implementation
- All 10 workflow interfaces
- Workflow chaining logic
- User authentication system
- Database schema design
- API service layer for integration
- **Full responsive design (Mobile/Tablet/Desktop)**
- Comprehensive documentation

### 🔄 In Progress
- Backend API implementation
- ComfyUI workflow development
- RunPod deployment setup
- Payment integration

### 📅 Planned
- PWA support
- Native mobile apps
- Real-time collaboration
- API marketplace
- Advanced analytics
- White-label solution

## 🚢 Deployment

### Frontend Deployment (Recommended: Vercel/Netlify)

```bash
# Build the project
npm run build

# Deploy the dist/ folder
# Configure environment variables in platform dashboard
```

### Backend Deployment
See [BACKEND_REQUIREMENTS.md](BACKEND_REQUIREMENTS.md) for backend deployment specifications.

## 🤝 Contributing

This is a proprietary project. For internal development:

1. Create a feature branch from `develop`
2. Make your changes with clear commit messages
3. Ensure responsive design on all breakpoints
4. Update relevant documentation
5. Submit a pull request
6. Ensure all tests pass

## 📖 Documentation Standards

- Keep all documentation up to date
- Use clear, concise language
- Include code examples
- Add use case scenarios
- Document responsive breakpoints
- Test on actual devices

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
```bash
# Run type checking
npm run typecheck
```

### Supabase Connection Issues
- Verify `.env` variables are correct
- Check Supabase project is active
- Ensure RLS policies are properly configured

### Responsive Issues
- Check Tailwind classes are applied
- Verify no conflicting CSS
- Test in browser DevTools responsive mode
- Review [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md)

## 📞 Support

### For Development Issues
1. Check the relevant documentation file
2. Review [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) for layout issues
3. Check browser console for errors
4. Verify environment variables
5. Test on multiple devices/browsers

### For Production Issues
1. Check backend API logs
2. Verify RunPod pod status
3. Review Supabase logs
4. Check generation status in database
5. Test responsive design on actual devices

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

- **Frontend Development**: Complete ✅
- **Responsive Design**: Complete ✅
- **Backend Development**: In Progress 🔄
- **ComfyUI Workflows**: Pending 📅
- **API Integration**: Pending 📅

## 🎯 Success Metrics

### Performance
- Generation time: < 30s average
- API response: < 500ms
- Uptime: > 99.9%
- Mobile load time: < 3s

### Business
- User satisfaction: > 4.5/5 stars
- Success rate: > 95%
- Monthly retention: > 70%
- Mobile users: ~40-50% of traffic

### Technical
- Error rate: < 2%
- Test coverage: > 80%
- Load capacity: 100+ concurrent users
- Responsive across all devices: ✅

## 🔗 Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [RunPod Dashboard](https://runpod.io)
- [Project Documentation](PROJECT_OVERVIEW.md)
- [Responsive Design Guide](RESPONSIVE_DESIGN.md)

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and AI**

**Designed for all devices** 📱 💻 🖥️

*For detailed implementation guides, see the documentation files in the root directory.*
