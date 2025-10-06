# HappyRobot Dashboard

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
- Backend API running on `http://localhost:3001` (see [happyrobot-challenge](https://github.com/0xalv/happyrobot-challenge))

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) in your browser.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

The dashboard connects to the backend API at `http://localhost:3001`. To change the API URL, update the fetch calls in the dashboard components.

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
