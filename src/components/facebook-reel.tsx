"use client";

import { useState } from "react";

declare global {
  interface Window {
    FB: any;
  }
}

interface Props {
  url: string;
}

export default function FacebookReel({ url }: Props) {
  const [isLoading, setIsLoading] = useState(true);

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
      <div style={{ position: "relative" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #e0e0e0",
                borderTop: "3px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        <iframe
          src={embedUrl}
          width="100%"
          height="600"
          style={{ border: "none", overflow: "hidden", display: "block", zIndex: 2, position: "relative" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </div>
  );
}
