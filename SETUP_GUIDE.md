# 🚀 SkillForge Learning Platform - Setup Guide

## 📋 Prerequisites

- **Node.js** 18.0+ 
- **npm** or **yarn**
- **Supabase Account** (optional - platform works in demo mode without it)
- **Hedera Testnet Account** (optional - for blockchain features)

## 🛠️ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

**Basic Configuration (Demo Mode):**
```env
# Hedera (Optional - for blockchain features)
VITE_HEDERA_ACCOUNT_ID=0.0.6478142
VITE_HEDERA_PRIVATE_KEY=3030020100300706052b8104000a042204201d38847744d48683b3ce6da76147d482005b4ac992f002ef9b62fcc24e5c1f7e
VITE_HEDERA_NETWORK=testnet

# Groq AI (Optional - for AI features)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Supabase (Optional - platform works without it)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to `http://localhost:3000`

## 🎯 Platform Features

### ✅ **Working in Demo Mode (No Backend Required)**
- **Course Catalog** - Browse and view course details
- **Course Enrollment** - Enroll in courses (stored locally)
- **Workshop System** - View and register for workshops
- **Community Forum** - Create posts and discussions (stored locally)
- **Leaderboard** - View rankings of registered users
- **User Authentication** - Register and login (stored locally)
- **AI Chat** - Interactive AI assistant
- **Progress Tracking** - Course and lesson progress
- **Certificate Generation** - Blockchain certificates (if Hedera configured)

### 🔧 **Enhanced with Supabase Backend**
- **Persistent Data** - All data stored in cloud database
- **Cross-Device Sync** - Access your data from any device
- **Real-time Updates** - Live forum updates and notifications
- **Advanced Analytics** - Detailed learning insights

## 🗄️ Supabase Setup (Optional)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 2. Run Database Setup
1. Open Supabase SQL Editor
2. Copy and paste the contents of `supabase_setup.sql`
3. Run the script to create tables

### 3. Update Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🔗 Hedera Blockchain Setup (Optional)

### 1. Get Testnet Account
1. Visit [portal.hedera.com](https://portal.hedera.com)
2. Create a testnet account
3. Get your Account ID and Private Key

### 2. Update Environment Variables
```env
VITE_HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
VITE_HEDERA_PRIVATE_KEY=YOUR_DER_ENCODED_PRIVATE_KEY
VITE_HEDERA_NETWORK=testnet
```

## 🤖 AI Features Setup (Optional)

### 1. Get Groq API Key
1. Visit [console.groq.com](https://console.groq.com)
2. Create an account and get API key

### 2. Update Environment Variables
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## 🎮 Using the Platform

### **Getting Started**
1. **Register/Login** - Create an account or sign in
2. **Browse Courses** - Explore the course catalog
3. **Enroll in Courses** - Click "Enroll Now" on any course
4. **Track Progress** - Complete lessons and quizzes
5. **Join Community** - Participate in forum discussions
6. **Compete** - Check your ranking on the leaderboard

### **Course System**
- **Browse Catalog** - Filter by category, level, rating
- **Course Details** - View modules, lessons, prerequisites
- **Enroll & Learn** - Track progress through structured content
- **Take Quizzes** - Test your knowledge with interactive quizzes
- **Earn Certificates** - Get blockchain-verified completion certificates

### **Workshop System**
- **Browse Workshops** - View upcoming live sessions
- **Register** - Sign up for workshops that interest you
- **Attend** - Join live sessions with expert instructors
- **Get Certificates** - Receive attendance certificates

### **Community Forum**
- **Browse Categories** - Explore different discussion topics
- **Create Posts** - Ask questions or share knowledge
- **Engage** - Reply to posts, like content, help others
- **Search** - Find specific discussions or topics

### **Gamification**
- **Earn Points** - Complete courses, attend workshops, participate in forums
- **Unlock Achievements** - Reach milestones and earn badges
- **Climb Leaderboard** - Compete with other learners
- **Track Streaks** - Maintain consistent learning habits

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### **Netlify**
1. Build: `npm run build`
2. Deploy `dist` folder to Netlify
3. Configure environment variables

## 🔧 Troubleshooting

### **Course Enrollment Issues**
- **Problem**: "Failed to enroll" error
- **Solution**: Platform works in demo mode - enrollments are stored locally. Check browser console for detailed errors.

### **Forum Post Creation Issues**
- **Problem**: Cannot create new posts
- **Solution**: Posts are stored locally in demo mode. Ensure you're logged in and try refreshing the page.

### **Leaderboard Empty**
- **Problem**: No users on leaderboard
- **Solution**: Register multiple accounts to see leaderboard populate with real users.

### **AI Chat Not Working**
- **Problem**: AI responses fail
- **Solution**: Add Groq API key to environment variables or use the chat in demo mode.

## 📊 Platform Architecture

### **Frontend Stack**
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching

### **Backend Integration**
- **Supabase** - PostgreSQL database with real-time features
- **Hedera SDK** - Blockchain integration for certificates
- **Groq AI** - AI-powered chat and insights
- **Local Storage** - Fallback for demo mode

### **Key Features**
- **Responsive Design** - Works on desktop, tablet, mobile
- **Dark/Light Mode** - Automatic theme switching
- **Offline Support** - Core features work offline
- **Progressive Web App** - Install as mobile app
- **Accessibility** - WCAG 2.1 AA compliant

## 🎯 Demo vs Production Mode

### **Demo Mode (Default)**
- ✅ All features work without backend setup
- ✅ Data stored locally in browser
- ✅ Perfect for testing and development
- ❌ Data not persistent across devices
- ❌ No real-time collaboration

### **Production Mode (With Supabase)**
- ✅ All demo features plus cloud storage
- ✅ Cross-device synchronization
- ✅ Real-time updates and notifications
- ✅ Advanced analytics and insights
- ✅ Scalable for multiple users

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

## 📞 Support

- **Issues**: Create GitHub issue for bugs or feature requests
- **Questions**: Use GitHub discussions for general questions
- **Documentation**: Check this README and code comments

---

**Built with ❤️ for the developer community**

*SkillForge - Where learning meets blockchain verification*