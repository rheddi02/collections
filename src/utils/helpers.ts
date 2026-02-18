export const getSource = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '').toLowerCase();

    // Map of domain patterns to display names
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

    // Check if we have a friendly name for this domain
    return platformMap[hostname] || hostname;
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return "Unknown Source";
  }
}

export const getYouTubeId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Handle youtu.be short links
    if (hostname.includes('youtu.be')) {
      return parsedUrl.pathname.slice(1); // Remove leading slash
    }

    // Handle youtube.com and www.youtube.com
    if (hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v');
      if (videoId) return videoId;

      // Handle embed URLs like youtube.com/embed/VIDEO_ID
      const match = parsedUrl.pathname.match(/\/embed\/([^/?]+)/);
      if (match) return match[1];
    }

    return null;
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return null;
  }
}