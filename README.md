# Acme Logistics Dashboard

Real-time monitoring dashboard for HappyRobot carrier call activity. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Real-time Activity Feed**: Live updates every 2 seconds showing call events
- **Carrier Information Panel**: Display verified carrier details from FMCSA
- **Load Details**: Show matched load information with full specifications
- **Negotiation Tracking**: Monitor negotiation rounds and decisions in real-time
- **Session Management**: Track multiple call sessions with `run_id`
- **Event Types**:
  - MC Verification (Success/Failed)
  - Load Search Results
  - Negotiation Rounds (Accept/Counter/Transfer)
  - Call Ended Summary

## 📁 Project Structure

```
/
├── app/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── ActivityFeed.tsx      # Real-time event timeline
│   │   │   ├── ActivityItem.tsx      # Individual event rendering
│   │   │   ├── CarrierInfoCard.tsx   # Carrier details panel
│   │   │   └── LoadDetailsCard.tsx   # Load information panel
│   │   └── page.tsx                   # Dashboard main page
│   └── api/                           # API route handlers (if needed)
├── lib/
│   └── formatters.ts                  # Event formatting utilities
├── types/
│   └── dashboard.ts                   # TypeScript type definitions
└── components/ui/                     # shadcn/ui components
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Backend API running on `https://happyrobot-challenge-production.up.railway.app` (see [happyrobot-challenge](https://github.com/0xalv/happyrobot-challenge))

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your:
#   - NEXT_PUBLIC_BACKEND_URL (default: https://happyrobot-challenge-production.up.railway.app)
#   - BACKEND_API_KEY (API key for backend authentication)

# Start development server
npm run dev
```

Open [https://happyrobot-dashboard-acme.vercel.app/dashboard](https://happyrobot-dashboard-acme.vercel.app/dashboard) in your browser.

## Vercel Deployment (Production)

Deploy the dashboard to Vercel's edge network for global performance.

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository with your code
- Backend API deployed and accessible (see backend README for Railway deployment)

### Deployment Steps

**1. Import Project to Vercel**
- Go to https://vercel.com/new
- Select "Import Git Repository"
- Connect your GitHub account and select `happyrobot-dashboard` repository
- Vercel will automatically detect Next.js configuration

**2. Configure Environment Variables**
- During import, add environment variables:
  - `NEXT_PUBLIC_BACKEND_URL`: Your Railway backend URL (e.g., `https://happyrobot-challenge-production.up.railway.app`)
  - `BACKEND_API_KEY`: Your backend API key (same as the `API_KEY` from backend deployment)
- Click "Deploy"

**3. Access Your Dashboard**
- Vercel will build and deploy your application
- Your dashboard will be available at: `https://your-project.vercel.app/dashboard`
- Vercel automatically generates a production URL

### Accessing Your Deployment

**Production Dashboard:** Your generated Vercel domain (e.g., `https://happyrobot-dashboard-acme.vercel.app/dashboard`)

**Custom Domain (Optional):**
- Go to project settings > Domains
- Add your custom domain and follow DNS configuration instructions

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL (must include protocol) | `https://your-api.up.railway.app` |
| `BACKEND_API_KEY` | Backend API authentication key (server-side only, not exposed to browser) | `your_api_key_here` |

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

### Troubleshooting

**API Connection Issues:**
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly (check for trailing slashes)
- Ensure backend API is accessible and returns CORS headers
- Check browser console for CORS errors

**Build Failures:**
- Review Vercel build logs for TypeScript errors
- Ensure all dependencies are in `package.json`
- Verify Next.js version compatibility

**Environment Variable Updates:**
- Update variables in Vercel project settings > Environment Variables
- Redeploy the project after changes (Vercel > Deployments > Redeploy)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Card, Badge, Button
- ScrollArea, Skeleton
- Custom styled components with Tailwind CSS

## 📊 How It Works

1. **Session Selection**: Choose "Wait Room" or enter a specific `run_id`
2. **Polling**: Dashboard polls `/api/activity/:run_id` every 2 seconds
3. **Event Display**: New events appear in the Activity Feed in real-time
4. **Auto-scroll**: Feed automatically scrolls to show latest events
5. **Carrier Panel**: Updates when MC verification succeeds
6. **Load Panel**: Shows when load is found and selected

## 🔗 Related Projects

- **Backend API**: [happyrobot-challenge](https://github.com/0xalv/happyrobot-challenge) - Express.js backend with Prisma + PostgreSQL

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Date Formatting**: date-fns
- **Icons**: Lucide React

## 📝 License

MIT
