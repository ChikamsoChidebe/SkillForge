
# 🚀 SkillForge - Immutable Learning Milestone Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Site-skillforgehedera.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://skillforgehedera.vercel.app)

## 🎥 Demo

[![Watch the demo](https://img.youtube.com/vi/jvYQj1r9we0/0.jpg)](https://youtu.be/jvYQj1r9we0)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-green.svg)](https://hedera.com/)

> **The future of learning verification.** Record your development journey on the blockchain and earn verifiable badges that prove your skills to the world.

## 🌟 Features

### 🔐 **Blockchain-Verified Learning**
- **Immutable Records**: Every learning milestone is permanently stored on Hedera blockchain
- **Global Verification**: Anyone can verify your achievements through HashScan
- **Tamper-Proof**: Your learning history cannot be altered or faked

### 🏆 **NFT Achievement Badges**
- **Milestone Rewards**: Unlock unique NFT badges as you progress (1, 5, 10, 20+ entries)
- **Rarity System**: Common, Uncommon, Rare, and Legendary badges
- **Verifiable Ownership**: True ownership of your achievements as blockchain assets

### 📊 **Comprehensive Analytics**
- **Learning Streaks**: Track your consistency and build learning habits
- **Category Insights**: Analyze your learning across different domains
- **Progress Visualization**: Beautiful charts and activity heatmaps
- **Performance Metrics**: Learning velocity, completion rates, and more

### 🎨 **Modern User Experience**
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching with system preference
- **Smooth Animations**: Framer Motion powered interactions
- **Accessibility First**: WCAG 2.1 AA compliant

## 🏗️ Architecture

### **Frontend Stack**
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Query** - Powerful data synchronization
- **React Hook Form** - Performant forms with easy validation

### **Blockchain Integration**
- **Hedera SDK** - Official Hedera Hashgraph SDK
- **Transaction Memos** - Learning entries stored as transaction metadata
- **NFT Minting** - Achievement badges as Non-Fungible Tokens
- **HashScan Integration** - Direct links to blockchain verification

### **State Management**
- **Zustand** - Lightweight state management
- **React Context** - Global app state and theme management
- **React Query** - Server state and caching

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0+ 
- **npm** or **yarn**
- **Hedera Testnet Account** (get one at [portal.hedera.com](https://portal.hedera.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skillforge.git
   cd skillforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   **Option A: Use Shared Demo Account (Quick Start)**
   ```env
   VITE_HEDERA_ACCOUNT_ID=0.0.6478142
   VITE_HEDERA_PRIVATE_KEY=3030020100300706052b8104000a042204201d38847744d48683b3ce6da76147d482005b4ac992f002ef9b62fcc24e5c1f7e
   VITE_HEDERA_NETWORK=testnet
   ```
   
   **Option B: Use Your Own Account (Recommended)**
   - Get testnet account at [portal.hedera.com](https://portal.hedera.com)
   - Use your DER encoded private key
   ```env
   VITE_HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
   VITE_HEDERA_PRIVATE_KEY=YOUR_DER_ENCODED_PRIVATE_KEY
   VITE_HEDERA_NETWORK=testnet
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage Guide

### **Getting Started**
1. **Connect Wallet**: Click "Connect Wallet" to link your Hedera account
2. **Record Learning**: Use "New Entry" to log tutorials, projects, courses
3. **Earn Badges**: Unlock achievement badges at 1, 5, 10, 20+ entries
4. **Share Progress**: Export your data or share your profile

### **Recording Entries**
- **Title**: Descriptive name for your learning milestone
- **Description**: What you learned, challenges faced, outcomes achieved
- **Category**: Tutorial, Project, Course, Workshop, Certification, etc.
- **Date**: When you completed the learning

### **Badge System**
- 🎯 **First Steps** (1 entry) - Common
- 🔥 **Learning Streak** (5 entries) - Uncommon  
- 🏗️ **Knowledge Builder** (10 entries) - Rare
- 👑 **Learning Master** (20 entries) - Legendary
- 🌟 **Dedicated Learner** (50 entries) - Legendary
- 🏆 **Learning Legend** (100 entries) - Legendary

## 🛠️ Development

### **Project Structure**
```
src/
├── api/            # Hedera SDK integration
├── components/     # React components (Atomic Design)
│   ├── atoms/      # Basic UI elements
│   ├── molecules/  # Component combinations
│   └── organisms/  # Complex components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── utils/          # Helper functions
└── assets/         # Static assets
```

### **Available Scripts**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run format      # Format code with Prettier
npm run test        # Run tests
```

### **Code Quality**
- **ESLint** - Code linting with Airbnb config
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **TypeScript** - Type checking (optional)

## 🌐 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### **Netlify**
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

### **Manual Deployment**
1. Build: `npm run build`
2. Upload `dist` folder to your hosting provider
3. Configure environment variables on your server

## 🔒 Security

### **Best Practices**
- ✅ Private keys never exposed in client bundle
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization
- ✅ HTTPS only in production
- ✅ Regular dependency updates

### **Hedera Security**
- All transactions are signed locally
- Private keys stored securely in environment variables
- Transaction memos are public (by design)
- NFT metadata follows Hedera standards

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hedera Hashgraph** - For the incredible blockchain platform
- **React Team** - For the amazing frontend framework
- **Tailwind CSS** - For the beautiful design system
- **Framer Motion** - For smooth animations
- **Open Source Community** - For all the amazing tools and libraries

## 📞 Support

- **Documentation**: [docs.skillforge.dev](https://docs.skillforge.dev)
- **Discord**: [Join our community](https://discord.gg/skillforge)
- **Twitter**: [@skillforge](https://twitter.com/skillforge)
- **Email**: support@skillforge.dev

## 🗺️ Roadmap

### **Phase 1: Core Features** ✅
- [x] Basic entry logging
- [x] Badge system
- [x] Hedera integration
- [x] Responsive design

### **Phase 2: Enhanced Features** 🚧
- [ ] Social sharing
- [ ] Team/Organization features
- [ ] Advanced analytics
- [ ] Mobile app

### **Phase 3: Ecosystem** 🔮
- [ ] API for third-party integrations
- [ ] Marketplace for learning resources
- [ ] Mentorship platform
- [ ] Corporate partnerships

---

**Built with ❤️ for the developer community**

*SkillForge - Where learning meets blockchain verification*