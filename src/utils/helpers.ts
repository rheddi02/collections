import ReactPlayer from "react-player";

const platformMap: Record<string, string> = {
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'facebook.com': 'Facebook',
  'fb.com': 'Facebook',
  'instagram.com': 'Instagram',
  'tiktok.com': 'TikTok',
  'twitter.com': 'Twitter',
  'x.com': 'X',
  'linkedin.com': 'LinkedIn',
  'vimeo.com': 'Vimeo',
  'twitch.tv': 'Twitch',
  'reddit.com': 'Reddit',
  'pinterest.com': 'Pinterest',
  'snapchat.com': 'Snapchat',
  'telegram.org': 'Telegram',
  'discord.com': 'Discord',
  'spotify.com': 'Spotify',
  'soundcloud.com': 'SoundCloud',
  'github.com': 'GitHub',
  'medium.com': 'Medium',
};
export const getSource = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '').toLowerCase();

    // Map of domain patterns to display names

    // Check if we have a friendly name for this domain
    return platformMap[hostname] || hostname;
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return "Unknown Source";
  }
}

export const truncateText = (text: string, limit: number) => {
  return text.length > limit
    ? text.substring(0, limit) + "..."
    : text;
}

export const copyToClipboard = (text: string): void => {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts (HTTP)
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try { document.execCommand("copy"); } finally { document.body.removeChild(el); }
};

export const isPlayableVideo = (url: string): boolean => {
  try {
    new URL(url);
    return ReactPlayer.canPlay(url);
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return false;
  }
}