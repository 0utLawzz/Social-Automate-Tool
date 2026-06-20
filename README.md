<div align="center">

<img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
<img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/AsyncStorage-offline--first-F5E642?style=for-the-badge" />
<img src="https://img.shields.io/badge/license-MIT-FF3CAC?style=for-the-badge" />

<br /><br />

```
██████╗  ██████╗ ███████╗████████╗██╗  ██╗   ██╗
██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██║  ╚██╗ ██╔╝
██████╔╝██║   ██║███████╗   ██║   ██║   ╚████╔╝
██╔═══╝ ██║   ██║╚════██║   ██║   ██║    ╚██╔╝
██║     ╚██████╔╝███████║   ██║   ███████╗██║
╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝
```

### Schedule smarter. Post everywhere. Look good doing it.

**Postly** is a funky dark-themed mobile app for scheduling content across  
**Facebook**, **YouTube**, and **TikTok** — all from one place.

[**Download on Expo Go**](#-getting-started) · [**Features**](#-features) · [**Connect Socials**](docs/SOCIAL_OAUTH.md) · [**Changelog**](CHANGELOG.md)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📱 **Multi-Platform** | Post to Facebook, YouTube, and TikTok simultaneously |
| 🖼️ **Format Selector** | 9:16 · 16:9 · 1:1 · 4:5 — platform-matched automatically |
| ⏰ **Smart Scheduling** | Post Now, In 1h, Tonight, Tomorrow, or Next Week |
| 📚 **Content Library** | Upload and reuse photos & videos across all posts |
| 📝 **Caption Templates** | 5 built-in templates + save your own for reuse |
| # **Hashtag Suggester** | Keyword-based hashtag recommendations from your caption |
| 🕐 **Best Time to Post** | Optimal time slots per platform — tap to auto-select |
| 📅 **Calendar View** | Month-view calendar with post dots and day filtering |
| 👁️ **Live Preview** | See exactly how your post looks on each platform |
| 📊 **Analytics Dashboard** | Platform breakdown, weekly stats, published vs queued |
| 🎯 **Post Campaigns** | Group related posts under a campaign name |
| 🌗 **Dark / Light Mode** | Toggle between Dark, Light, and System theme |
| 🚀 **Onboarding** | First-run walkthrough guides new users through setup |

---

## 🎨 Design

| Token | Value | Use |
|---|---|---|
| Primary | `#F5E642` | Electric Yellow — buttons, highlights |
| Accent | `#FF3CAC` | Hot Pink — badges, notifications |
| Background | `#0A0A14` | Deep Dark (dark mode) |
| Background | `#F8F7F0` | Warm Cream (light mode) |
| Font | **Poppins** | Black, Bold, SemiBold, Regular |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/installation)
- [Expo Go](https://expo.dev/go) app on your phone (iOS or Android)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/postly.git
cd postly

# 2. Install all workspace dependencies
pnpm install

# 3. Start the Expo development server
pnpm --filter @workspace/social-scheduler run dev
```

### Running on Your Device

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code shown in your terminal with:
   - **iOS**: Camera app → tap the banner
   - **Android**: Expo Go app → tap "Scan QR code"

### Running on Web (preview only)

```bash
# The web preview starts automatically at:
# http://localhost:19789
```

> **Note:** The web preview is for development only. The full native experience (haptics, camera, notifications) requires a real device with Expo Go.

---

## 📂 Project Structure

```
postly/
├── artifacts/
│   ├── social-scheduler/          # 📱 Expo mobile app
│   │   ├── app/
│   │   │   ├── _layout.tsx        # Root layout + providers
│   │   │   └── (tabs)/            # 5 tab screens
│   │   │       ├── index.tsx      # Home — dashboard + analytics
│   │   │       ├── library.tsx    # Content library
│   │   │       ├── create.tsx     # Post creation
│   │   │       ├── queue.tsx      # Calendar view
│   │   │       └── accounts.tsx   # Accounts + settings
│   │   ├── components/            # Shared UI components
│   │   ├── context/               # React Context providers
│   │   ├── hooks/                 # Custom hooks
│   │   ├── constants/colors.ts    # Dark + Light theme tokens
│   │   └── types/index.ts         # TypeScript types
│   └── api-server/                # 🖥️ Express API (future backend)
├── lib/                           # Shared libraries
├── docs/
│   └── SOCIAL_OAUTH.md            # How to connect real social APIs
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## 🔗 Connecting Real Social Accounts

> Currently, Postly saves your account handles **locally on your device** for scheduling and organizing. Real publishing via platform APIs requires OAuth credentials from each platform.

**Read the full setup guide:** [docs/SOCIAL_OAUTH.md](docs/SOCIAL_OAUTH.md)

| Platform | API | Status |
|---|---|---|
| Facebook | Graph API · Pages API | 📋 Setup guide available |
| YouTube | YouTube Data API v3 | 📋 Setup guide available |
| TikTok | Content Posting API | 📋 Setup guide available |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo 52](https://expo.dev) + [React Native](https://reactnative.dev) |
| Language | [TypeScript 5.9](https://typescriptlang.org) |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| Storage | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) |
| Fonts | [Poppins via @expo-google-fonts](https://github.com/expo/google-fonts) |
| Icons | [Expo Vector Icons](https://icons.expo.fyi) |
| Package Manager | [pnpm 9](https://pnpm.io) workspaces |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © Postly — Built with love and electric yellow.
