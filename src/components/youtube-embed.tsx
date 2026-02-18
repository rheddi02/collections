"use client";

import { useState } from "react";

interface Props {
  videoId: string;
}

export default function YouTubeEmbed({ videoId }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ maxWidth: "800px", width: "100%" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%", // 16:9
          height: 0,
          backgroundColor: isLoading ? "#f0f0f0" : "transparent",
        }}
      >
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
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
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
