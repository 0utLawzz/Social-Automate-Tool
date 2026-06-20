# Connecting Real Social Media Accounts

> **Current state**: Postly v1.0 saves your handles and schedules locally for organization. This guide explains how to wire up real API publishing once you're ready to go live.

---

## How Publishing Will Work

When real API credentials are added, the flow looks like this:

```
User taps "Publish" or schedule fires
        ↓
Postly reads stored access token for each platform
        ↓
Calls platform API with post content + media
        ↓
Platform publishes the post
        ↓
Postly marks post as "Published" in local storage
```

The account connect modal will be upgraded to open an OAuth browser session instead of asking for a manual handle.

---

## 📘 Facebook

### What you need

| Item | Where to get it |
|---|---|
| Facebook App | [developers.facebook.com](https://developers.facebook.com/) |
| App ID + App Secret | Facebook App Dashboard |
| Pages API permission | `pages_manage_posts`, `pages_read_engagement` |
| Access Token | OAuth flow → long-lived page token |

### Steps

1. Go to [developers.facebook.com](https://developers.facebook.com/) → **My Apps** → **Create App**
2. Select **Business** as the app type
3. Add the **Facebook Login** product
4. Add the **Pages API** product
5. In App Settings → Basic, copy your **App ID** and **App Secret**
6. Request permissions: `pages_manage_posts`, `pages_read_engagement`, `publish_pages`
7. Submit for App Review (required for publishing to public pages)

### Environment Variables

```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

### API Call (example)

```typescript
// POST /{page-id}/feed
const response = await fetch(
  `https://graph.facebook.com/v19.0/${pageId}/feed`,
  {
    method: 'POST',
    body: JSON.stringify({
      message: postContent,
      access_token: pageAccessToken,
    }),
  }
);
```

---

## 📺 YouTube

### What you need

| Item | Where to get it |
|---|---|
| Google Cloud Project | [console.cloud.google.com](https://console.cloud.google.com/) |
| YouTube Data API v3 | Google Cloud Console → Enable APIs |
| OAuth 2.0 Client ID | Google Cloud Console → Credentials |
| Scopes | `youtube.upload`, `youtube.readonly` |

### Steps

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) → Create a new project
2. Navigate to **APIs & Services** → **Library**
3. Search for **YouTube Data API v3** → Enable
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **iOS** or **Android** as application type
6. Copy the **Client ID**
7. Configure the OAuth consent screen with your app name and logo
8. Add the scopes: `https://www.googleapis.com/auth/youtube.upload`

### Environment Variables

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### API Call (example)

```typescript
// Videos: insert (multipart upload)
// POST https://www.googleapis.com/upload/youtube/v3/videos
const response = await fetch(
  'https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/related',
    },
    body: videoData,
  }
);
```

---

## 🎵 TikTok

### What you need

| Item | Where to get it |
|---|---|
| TikTok Developer Account | [developers.tiktok.com](https://developers.tiktok.com/) |
| App + Client Key | TikTok Developer Portal |
| Content Posting API | Apply separately (requires review) |
| Scopes | `video.upload`, `video.publish` |

### Steps

1. Go to [developers.tiktok.com](https://developers.tiktok.com/) → **Manage Apps** → **Create App**
2. Fill in your app details (name, description, icon)
3. Add **Login Kit** and **Content Posting API** products
4. Apply for **Content Posting API** access (takes 1–4 weeks for approval)
5. Once approved, copy your **Client Key** and **Client Secret**
6. Set your redirect URI in the app settings

### Environment Variables

```env
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
```

### API Call (example)

```typescript
// POST https://open.tiktokapis.com/v2/post/publish/video/init/
const response = await fetch(
  'https://open.tiktokapis.com/v2/post/publish/video/init/',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      post_info: {
        title: caption,
        privacy_level: 'SELF_ONLY', // or PUBLIC_TO_EVERYONE
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoSizeBytes,
        chunk_size: chunkSizeBytes,
        total_chunk_count: 1,
      },
    }),
  }
);
```

---

## 🔐 Storing Tokens Securely

Never store access tokens in AsyncStorage. Use **expo-secure-store**:

```bash
pnpm --filter @workspace/social-scheduler add expo-secure-store
```

```typescript
import * as SecureStore from 'expo-secure-store';

// Save
await SecureStore.setItemAsync('facebook_token', accessToken);

// Read
const token = await SecureStore.getItemAsync('facebook_token');
```

---

## 🛣️ Implementation Roadmap

| Step | What to build | Difficulty |
|---|---|---|
| 1 | Add `expo-auth-session` for OAuth browser flow | Easy |
| 2 | Add `expo-secure-store` for token storage | Easy |
| 3 | Build token exchange on API server (secrets never in mobile code) | Medium |
| 4 | Facebook Pages API publish route | Medium |
| 5 | YouTube upload route (chunked video) | Medium |
| 6 | TikTok Content Posting API (after approval) | Medium |
| 7 | Background job to fire scheduled posts at the right time | Hard |
| 8 | Webhook to receive platform publish confirmations | Hard |

---

## 💬 Questions?

Open an issue on GitHub or check [CONTRIBUTING.md](../CONTRIBUTING.md).
