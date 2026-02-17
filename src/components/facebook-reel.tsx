"use client";

declare global {
  interface Window {
    FB: any;
  }
}

interface Props {
  url: string;
}

export default function FacebookReel({ url }: Props) {
  if (!url) return null;

  // Convert Facebook URL to embed format
  const getEmbedUrl = (facebookUrl: string) => {
    try {
      // If it's already a share URL or regular URL, use it directly with the embed API
      // Facebook's embed API can handle various URL formats
      const encodedUrl = encodeURIComponent(facebookUrl);
      return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&width=500&show_text=false&allowfullscreen=true`;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div style={{ maxWidth: "500px", width: "100%" }}>
      <iframe
        src={embedUrl}
        width="100%"
        height="600"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
}
