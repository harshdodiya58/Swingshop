"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#F7F3EA",
          color: "#2A2118",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "16px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <span
            style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "12px", color: "#9A5A24" }}
          >
            500
          </span>
          <h1 style={{ fontSize: "40px", margin: 0 }}>
            Something went wrong in the workshop
          </h1>
          <p style={{ color: "#7A6E5E", maxWidth: "440px", margin: 0 }}>
            An unexpected error occurred. Try reloading — or head back to the
            collection.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={retry}
              style={{
                borderRadius: "9999px",
                padding: "12px 28px",
                background: "#9A5A24",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Try again
            </button>
            <button
              onClick={() => {
                // global-error renders outside the router context; use a hard navigation.
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.assign("/");
              }}
              style={{
                borderRadius: "9999px",
                padding: "12px 28px",
                border: "1px solid #E7DFCF",
                color: "#2A2118",
                background: "transparent",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}