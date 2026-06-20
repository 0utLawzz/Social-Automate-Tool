export type Platform = 'facebook' | 'youtube' | 'tiktok';
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
export type PostStatus = 'draft' | 'scheduled' | 'published';
export type ThemePreference = 'system' | 'dark' | 'light';

export interface Post {
  id: string;
  content: string;
  mediaUri?: string;
  platforms: Platform[];
  format: AspectRatio;
  scheduledAt: string | null;
  status: PostStatus;
  campaignName?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  platform: Platform;
  username: string;
  handle: string;
  followers: number;
  connected: boolean;
}

export interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  addedAt: string;
}

export interface CaptionTemplate {
  id: string;
  name: string;
  text: string;
  isDefault?: boolean;
}

export const PLATFORM_FORMATS: Record<Platform, AspectRatio[]> = {
  facebook: ['1:1', '4:5', '16:9', '9:16'],
  youtube: ['16:9', '9:16'],
  tiktok: ['9:16'],
};

export const FORMAT_LABELS: Record<AspectRatio, string> = {
  '9:16': 'Vertical',
  '16:9': 'Landscape',
  '1:1': 'Square',
  '4:5': 'Portrait',
};

export const PLATFORM_NAMES: Record<Platform, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  facebook: '#1877F2',
  youtube: '#FF0000',
  tiktok: '#69C9D0',
};

export const PLATFORM_HINTS: Record<Platform, string> = {
  facebook: 'Your Facebook Page or Profile name',
  youtube: 'Your YouTube channel name',
  tiktok: 'Your TikTok username',
};

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc_fb', platform: 'facebook', username: '', handle: '', followers: 0, connected: false },
  { id: 'acc_yt', platform: 'youtube', username: '', handle: '', followers: 0, connected: false },
  { id: 'acc_tt', platform: 'tiktok', username: '', handle: '', followers: 0, connected: false },
];

export const DEFAULT_TEMPLATES: CaptionTemplate[] = [
  { id: 'dt1', name: 'Product Launch', isDefault: true, text: 'Excited to announce something game-changing! Stay tuned for more details.\n\n#launch #announcement #comingsoon' },
  { id: 'dt2', name: 'Behind the Scenes', isDefault: true, text: 'A peek behind the curtain at what we have been working on. Pure creative chaos.\n\n#behindthescenes #bts #creative' },
  { id: 'dt3', name: 'Motivational', isDefault: true, text: 'Every great creator started with zero. The difference is they kept going.\n\n#motivation #creator #mindset' },
  { id: 'dt4', name: 'Q&A', isDefault: true, text: 'Drop your questions below! Happy to answer everything.\n\n#qa #community #askmeanything' },
  { id: 'dt5', name: 'Weekend', isDefault: true, text: 'Making the most of the weekend. What are you all up to today?\n\n#weekend #lifestyle #community' },
];
