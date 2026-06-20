# Changelog

All notable changes to **Postly** are documented here.  
This project follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-06-20

### 🎉 Initial Release

#### Core App
- Expo (React Native) mobile app with Expo Router file-based navigation
- 5-tab layout: **Home · Library · Create · Calendar · Accounts**
- Offline-first architecture — all data stored in AsyncStorage
- Electric yellow (`#F5E642`) + hot pink (`#FF3CAC`) dark theme
- Poppins font family (Black, Bold, SemiBold, Regular)

#### Features Added

**Accounts**
- Connect Facebook, YouTube, and TikTok accounts by entering handle and follower count
- Account data saved privately on device
- Disconnect with confirmation prompt
- Format compatibility guide per platform

**Post Creation**
- Multi-platform posting: select one or all connected accounts
- Format selector with per-platform compatibility indicators (9:16, 16:9, 1:1, 4:5)
- Media picker (photos + videos from device gallery)
- Character counter (2,200 max)
- Status: Publish Now · Schedule for later

**Scheduling**
- 5 schedule options: Now · In 1h · Tonight (8PM) · Tomorrow (9AM) · Next Week (9AM)
- Best Time to Post: optimal time slots shown per selected platform
- Campaign name field to group related posts

**Caption Tools**
- Caption Templates: 5 built-in + unlimited user-saved templates
- Hashtag Suggester: keyword extraction from caption text → relevant hashtag chips
- Tap hashtag to append to caption

**Content Library**
- Grid view of saved photos and videos
- Add from gallery, reuse in posts
- Quick-pick the last 5 library items in the Create screen
- Video badge overlay for video items

**Calendar View**
- Month calendar with previous/next navigation
- Colored dots on days with scheduled posts
- Tap any day to filter post list below
- Filter chips: All · Scheduled · Published · Drafts

**Post Preview**
- Cross-platform preview modal (eye icon in Create)
- Platform tabs: Facebook timeline card · YouTube video thumbnail · TikTok full-screen
- Shows real handle, caption, and media

**Analytics Dashboard**
- Embedded in Home tab
- Platform bar chart (posts per platform)
- Weekly, Published, and Queued stat cards

**Theme**
- Dark / Light / System toggle in Accounts tab
- Theme persists across app sessions
- Light mode: warm cream (`#F8F7F0`) background with yellow + pink accents

**Onboarding**
- 4-slide first-run walkthrough modal
- Covers: Welcome → Connect Accounts → Create & Schedule → Analytics
- Skip or page through with Next
- Shown only once, skippable at any time

---

## [Upcoming]

- [ ] Real OAuth publishing (Facebook Graph API, YouTube Data API, TikTok Content API)
- [ ] Push notifications for scheduled post reminders
- [ ] Bulk scheduling from content plan
- [ ] Post series / recurring posts
- [ ] Export analytics as CSV
- [ ] Multi-account per platform (e.g. 2 Facebook Pages)
