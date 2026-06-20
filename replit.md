# Postly — Social Media Scheduler

A funky dark-themed mobile app for scheduling content across Facebook, YouTube, and TikTok — built with Expo (React Native), TypeScript, and AsyncStorage.

## Run & Operate

- `pnpm --filter @workspace/social-scheduler run dev` — run the Expo app (scan QR with Expo Go)
- `pnpm --filter @workspace/api-server run dev` — run the API server on port 5000
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo 52, React Native, Expo Router (file-based routing)
- State: React Context + AsyncStorage (offline-first, no backend required)
- Fonts: Poppins (via @expo-google-fonts/poppins)
- UI: expo-linear-gradient, expo-image-picker, react-native-safe-area-context
- API: Express 5 (api-server artifact, unused by mobile for now)

## Where things live

```
artifacts/social-scheduler/
├── app/
│   ├── _layout.tsx           # Root layout, providers, onboarding
│   └── (tabs)/
│       ├── index.tsx         # Home — dashboard + analytics
│       ├── library.tsx       # Content library
│       ├── create.tsx        # Post creation (all features)
│       ├── queue.tsx         # Calendar view
│       └── accounts.tsx      # Social accounts + theme toggle
├── components/               # Shared UI components
├── context/                  # ThemeContext, LibraryContext, PostsContext
├── hooks/                    # useColors (theme-aware)
├── constants/colors.ts       # Dark + Light theme tokens
└── types/index.ts            # All shared types
```

## Architecture decisions

- **Offline-first**: All data (posts, accounts, templates, library) lives in AsyncStorage. No backend required for core scheduling features.
- **Theme system**: ThemeContext overrides system color scheme; `useColors()` reads from ThemeContext rather than `useColorScheme()` directly.
- **5 tabs**: Home, Library, Create, Calendar, Accounts — staying within Android's safe tab count.
- **Demo auth**: Accounts are manually entered (handle + followers). Real OAuth publishing requires platform API credentials (see `docs/SOCIAL_OAUTH.md`).
- **Colors**: Electric yellow `#F5E642` primary, hot pink `#FF3CAC` accent, `#0A0A14` deep dark background.

## Product

Postly is a social media scheduling app for creators. Users connect their Facebook, YouTube, and TikTok accounts, create posts with the right format per platform, schedule them to go live at optimal times, and track their content from a single dashboard.

**Features shipped:**
- Multi-platform post creation (Facebook, YouTube, TikTok)
- Format selector with per-platform compatibility (9:16, 16:9, 1:1, 4:5)
- Post scheduling (Now, 1h, Tonight, Tomorrow, Next Week)
- Content Library — reusable media across posts
- Caption Templates — built-in + user-saved
- Hashtag Suggester — keyword-based suggestions
- Best Time to Post — per-platform optimal slots
- Calendar View — month grid with post dots
- Cross-Platform Preview — see FB/YT/TT layout before posting
- Analytics Dashboard — platform breakdown + weekly stats
- Post Campaigns — group posts by campaign name
- Dark / Light / System theme toggle
- Onboarding Walkthrough — first-run 4-slide guide
- Empty state onboarding on Home when no accounts connected

## User preferences

- Dark funky aesthetic is the identity — preserve electric yellow + hot pink always
- Non-coder UX: every screen should have clear empty states and obvious CTAs
- No dummy/mock data in initial state — users should enter real info

## Gotchas

- `useColors()` must be called inside ThemeProvider (set up in `_layout.tsx`)
- AsyncStorage keys versioned with suffix (`_v1`, `_v2`) — bump when shape changes
- Expo web preview runs at a different URL from Expo Go — QR code is for Expo Go on real device
- `MediaTypeOptions` is deprecated in newer expo-image-picker — use array syntax: `['images', 'videos']`

## Pointers

- See `docs/SOCIAL_OAUTH.md` for how to connect real Facebook/YouTube/TikTok API credentials
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
